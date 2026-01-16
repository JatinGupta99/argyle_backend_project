'use client';

import { useCallback, useEffect } from 'react';
import { useSocket } from './useSocket';
import { ChatSessionType, ChatCategoryType } from '@/lib/constants/chat';
import { Message } from '@/lib/types/api';
import { useInfiniteQuery, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { useAuth } from '@/app/auth/auth-context';
import { extractChatUserFromToken } from '@/lib/utils/jwt-utils';

interface UseChatOptions {
    eventId: string;
    sessionType?: ChatSessionType;
    activeCategory?: ChatCategoryType;
    isChatEnabled?: boolean;
}

export function useChat({
    eventId,
    sessionType = ChatSessionType.LIVE,
    activeCategory = ChatCategoryType.CHAT,
    isChatEnabled = true
}: UseChatOptions) {
    const queryClient = useQueryClient();
    // Replaced Redux selector with AuthContext + Token Decode
    // const currentUser = useSelector((state: RootState) => state.user);
    const { token, userId, role } = useAuth();
    const { socket, isConnected, emit, on, off } = useSocket();

    // Extract complete user details from token
    const chatUser = token ? extractChatUserFromToken(token) : null;

    const queryKey = ['messages', eventId, sessionType, activeCategory];

    // 1. History Hydration (REST API)
    const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
        const query: any = {
            limit: 50,
            sessionType,
            category: activeCategory
        };
        if (pageParam) query.before = pageParam;

        const response = await apiClient.get<Message[]>(API_ROUTES.chat.history(eventId, query));
        // Handle potentially wrapped response if API returns { data: [] }
        const data = (Array.isArray(response) ? response : (response as any).data) ?? [];
        return data as Message[];
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey,
        queryFn: fetchMessages,
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 50) return undefined;
            const oldest = lastPage[lastPage.length - 1]; // Assuming sorted newest -> oldest
            return oldest?.createdAt;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const messages = data?.pages.flatMap(page => page) ?? [];

    // 2. Socket Lifecycle Management
    useEffect(() => {
        if (!socket || !isConnected || !eventId) return;

        const shouldConnect = sessionType === ChatSessionType.LIVE || (sessionType === ChatSessionType.PRE_LIVE && isChatEnabled);

        if (shouldConnect) {
            console.log(`[useChat] Joining Room -> event:${eventId}:${sessionType}:${activeCategory}`);
            emit('joinRoom', {
                eventId,
                sessionType,
                category: activeCategory,
            });
        }

        return () => {
            if (shouldConnect) {
                console.log(`[useChat] Leaving Room -> event:${eventId}:${sessionType}:${activeCategory}`);
                emit('leaveRoom', {
                    eventId,
                    sessionType,
                    category: activeCategory,
                });
            }
        };
    }, [socket, isConnected, eventId, sessionType, activeCategory, isChatEnabled]); // Removed 'emit' and others that might trigger unnecessarily

    // 3. Real-time Updates (Socket -> Query Cache)
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (payload: { message: any }) => {
            const raw = payload.message;
            if (!raw || raw.eventId !== eventId || raw.category !== activeCategory) return;
            // Additional check for sessionType if backend broadcasts it
            if (raw.sessionType && raw.sessionType !== sessionType) return;


            const newMessage: Message = {
                _id: raw._id || `ws-${Date.now()}`,
                content: raw.content,
                createdAt: raw.createdAt || new Date().toISOString(),
                updatedAt: raw.updatedAt || new Date().toISOString(),
                userId: (raw.userId && typeof raw.userId === 'object') ? raw.userId : {
                    _id: raw.senderId || 'unknown',
                    username: raw.senderName || 'Guest',
                    email: '',
                    avatar: raw.senderAvatar,
                    role: raw.role
                },
                likes: raw.likes || [],
                comments: raw.comments || []
            };

            console.log('[useChat] Received via WS:', newMessage);

            queryClient.setQueryData<InfiniteData<Message[]>>(queryKey, (oldData) => {
                if (!oldData) return { pages: [[newMessage]], pageParams: [undefined] };

                // 1. Exact ID Dedup
                const allMessages = oldData.pages.flatMap(p => p);
                if (allMessages.some(m => m._id === newMessage._id)) return oldData;

                // 2. Temp ID Replacement (Deduplication for optimistic UI)
                const isDuplicate = allMessages.some(m => {
                    if (!m._id.startsWith('temp-')) return false;
                    const timeDiff = Math.abs(new Date(m.createdAt).getTime() - new Date(newMessage.createdAt).getTime());
                    return m.content === newMessage.content && m.userId._id === newMessage.userId._id && timeDiff < 10000;
                });

                const newPages = [...oldData.pages];
                if (isDuplicate) {
                    // Replace the temp message with the real one in the correct page
                    newPages.forEach((page, pIdx) => {
                        const mIdx = page.findIndex(m =>
                            m._id.startsWith('temp-') &&
                            m.content === newMessage.content &&
                            m.userId._id === newMessage.userId._id
                        );
                        if (mIdx !== -1) {
                            page[mIdx] = newMessage;
                        }
                    });
                } else {
                    // Prepend new message
                    if (newPages.length > 0) {
                        newPages[0] = [newMessage, ...newPages[0]];
                    } else {
                        newPages[0] = [newMessage];
                    }
                }

                return { ...oldData, pages: newPages };
            });
        };

        on('newMessage', handleNewMessage);
        return () => {
            off('newMessage', handleNewMessage);
        };
    }, [socket, eventId, activeCategory, sessionType, queryClient, queryKey]); // Optimized dependencies

    // 4. Sending (Socket-Driven for Real-time)
    const sendMessage = useCallback((content: string) => {
        if (!content.trim()) return;

        // Prepare user object from token or default
        const userPayload = chatUser || {
            _id: userId || 'guest',
            role: role || 'Attendee',
            name: 'Guest User',
            avatar: null,
            email: null
        };

        const tempId = `temp-${Date.now()}`;
        const optimistMsg: Message = {
            _id: tempId,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: {
                _id: userPayload._id,
                username: userPayload.name,
                email: userPayload.email || '',
            },
            likes: [],
            comments: []
        };

        // Optimistic Update
        queryClient.setQueryData<InfiniteData<Message[]>>(queryKey, (oldData) => {
            if (!oldData) return { pages: [[optimistMsg]], pageParams: [undefined] };
            const newPages = [...oldData.pages];
            newPages[0] = [optimistMsg, ...newPages[0]];
            return { ...oldData, pages: newPages };
        });

        // 1. Emit Socket (Primary for sending)
        // Backend handles DB persistence and broadcasts 'newMessage'
        emit('sendMessage', {
            eventId,
            content,
            sessionType,
            category: activeCategory,
            user: userPayload
        });

        // REST POST is REMOVED for sending to avoid redundancy and out-of-order execution
        // History/Pagination still use REST (see fetchMessages)
    }, [emit, eventId, sessionType, activeCategory, chatUser, userId, role, queryKey, queryClient]);

    return {
        messages,
        sendMessage,
        isLoading,
        isConnected,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    };
}
