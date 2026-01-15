'use client';

import { useCallback, useEffect } from 'react';
import { useSocket } from './useSocket';
import { ChatSessionType, ChatCategoryType } from '@/lib/constants/chat';
import { Message } from '@/lib/types/api';
import { useInfiniteQuery, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { useAuth } from '@/app/auth/auth-context';
import { extractNameFromToken, extractEmailFromToken } from '@/lib/utils/jwt-utils';

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

    const userName = token ? extractNameFromToken(token) : 'Guest';
    const userEmail = token ? extractEmailFromToken(token) : null;

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
            console.log(`[useChat] Joining ${sessionType}:${activeCategory}`);
            emit('joinRoom', {
                eventId,
                sessionType,
                category: activeCategory,
            });
        }

        return () => {
            if (shouldConnect) {
                // Optional: emit('leaveRoom', ...) if backend supports it
            }
        };
    }, [socket, isConnected, eventId, sessionType, activeCategory, isChatEnabled, emit]);

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

                // Dedup
                const allMessages = oldData.pages.flatMap(p => p);
                if (allMessages.some(m => m._id === newMessage._id)) return oldData;

                const newPages = [...oldData.pages];
                if (newPages.length > 0) {
                    newPages[0] = [newMessage, ...newPages[0]];
                } else {
                    newPages[0] = [newMessage];
                }
                return { ...oldData, pages: newPages };
            });
        };

        on('newMessage', handleNewMessage);
        return () => {
            off('newMessage', handleNewMessage);
        };
    }, [socket, eventId, activeCategory, sessionType, queryClient, queryKey, on, off]);

    // 4. Sending (Optimistic UI + Socket)
    const sendMessage = useCallback((content: string) => {
        if (!content.trim()) return;

        const tempId = `temp-${Date.now()}`;
        const optimistMsg: Message = {
            _id: tempId,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: {
                _id: userId || 'me',
                username: userName || 'Me',
                email: '',
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

        // Prepare user object
        const userPayload = {
            _id: userId || 'guest',
            role: role || 'Attendee',
            name: userName || 'Guest User',
            avatar: null,
            email: userEmail || null
        };

        // 1. Emit Socket (Real-time speed)
        emit('sendMessage', {
            eventId,
            content,
            sessionType,
            category: activeCategory,
            senderName: userName,
            user: userPayload
        });

        // 2. Persist via REST API (Reliability)
        try {
            // Note: API expects { content, sessionType, category, user } in body
            apiClient.post(API_ROUTES.chat.create(eventId), {
                content,
                sessionType,
                category: activeCategory,
                user: userPayload
            }).catch(err => {
                console.error('[useChat] Failed to persist message:', err);
                // Optional: Trigger rollback or error toast
            });
        } catch (e) {
            console.error('[useChat] API call error', e);
        }

        // We assume socket 'newMessage' broadcast will eventually replace this temp message
        // or we could handle ack if socket supported it.
    }, [emit, eventId, sessionType, activeCategory, userId, userName, userEmail, role, queryClient, queryKey]);

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
