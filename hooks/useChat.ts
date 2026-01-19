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
    const { socket, isConnected, emitOnce, emit, on, off } = useSocket();

    // Extract complete user details from token
    const chatUser = token ? extractChatUserFromToken(token) : null;

    const queryKey = ['messages', eventId, sessionType, activeCategory];

    // 1. History Hydration (REST API)
    const fetchMessages = async ({ pageParam }: { pageParam?: { before?: string; after?: string } }) => {
        const query: any = {
            limit: 50,
            sessionType,
            category: activeCategory
        };

        if (pageParam?.before) query.before = pageParam.before;
        if (pageParam?.after) query.after = pageParam.after;

        const response = await apiClient.get<Message[]>(API_ROUTES.chat.history(eventId, query));
        const rawData = (Array.isArray(response) ? response : (response as any).data) ?? [];

        // Normalize the history data to match our standard Message interface
        return rawData.map((m: any) => {
            const rawUser = m.user || m.userId;
            return {
                ...m,
                userId: (rawUser && typeof rawUser === 'object') ? {
                    _id: String(rawUser._id || rawUser.id || m.senderId || 'unknown'),
                    username: rawUser.username || rawUser.name || rawUser.displayName || m.senderName || 'Guest',
                    email: rawUser.email || '',
                    avatar: rawUser.avatar || rawUser.pictureUrl || m.senderAvatar || '',
                    role: rawUser.role || m.role || 'Attendee'
                } : {
                    _id: String(m.senderId || 'unknown'),
                    username: m.senderName || 'Guest',
                    email: '',
                    avatar: m.senderAvatar || '',
                    role: m.role || 'Attendee'
                }
            };
        }) as Message[];
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        fetchPreviousPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
        isLoading
    } = useInfiniteQuery<Message[], Error, InfiniteData<Message[]>, any, { before?: string; after?: string }>({
        queryKey,
        queryFn: fetchMessages,
        initialPageParam: {},
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 50) return undefined;
            const oldest = lastPage[0];
            return { before: oldest?.createdAt };
        },
        getPreviousPageParam: (firstPage) => {
            if (!firstPage || firstPage.length < 50) return undefined;
            const newest = firstPage[firstPage.length - 1];
            return { after: newest?.createdAt };
        },
        staleTime: 1000 * 60 * 5,
    });

    const messages = data?.pages.flatMap(page => page) ?? [];

    // 2. Socket Lifecycle Management
    useEffect(() => {
        if (!socket || !isConnected || !eventId) return;

        // Rule 2: Join event ONCE after connect (for moderation events)
        emitOnce('joinEvent', { eventId }, `joinEvent-${eventId}`);

        const shouldConnect = sessionType === ChatSessionType.LIVE || (sessionType === ChatSessionType.PRE_LIVE && isChatEnabled);

        if (shouldConnect) {
            console.log(`🏠 [useChat] INTENT: Join Room -> ${eventId}:${sessionType}:${activeCategory}`);
            // Rule 3: Join chat room ONLY when tab changes (eventId, sessionType, or category)
            emit('joinRoom', {
                eventId,
                sessionType,
                category: activeCategory,
            }, (res: any) => {
                if (res && !res.ok) {
                    console.error('❌ [useChat] Join Room BLOCKED by backend:', res.error || 'Unknown error');
                } else {
                    console.log('✅ [useChat] Join Room SUCCESS');
                }
            });
        }
    }, [socket, isConnected, eventId, sessionType, activeCategory, isChatEnabled, emit, emitOnce]);

    // 3. Real-time Updates (Socket -> Query Cache)
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (payload: any) => {
            console.log('⚡ [useChat] Received WS Payload:', payload);
            const raw = payload?.message || payload;

            if (!raw || !raw.content) return;

            // Rule 5: We verify room metadata ONLY if present in the payload.
            // Primarily we rely on Socket.IO room isolation (Rule 3/4).
            const eventIdMatch = !raw.eventId || String(raw.eventId) === String(eventId);
            const categoryMatch = !raw.category || String(raw.category).toLowerCase() === String(activeCategory).toLowerCase();
            const sessionTypeMatch = !raw.sessionType || String(raw.sessionType).toLowerCase() === String(sessionType).toLowerCase();

            if (!eventIdMatch || !categoryMatch || !sessionTypeMatch) {
                console.warn('⚠️ [useChat] Ignored message from another room context', {
                    received: { eid: raw.eventId, cat: raw.category, sess: raw.sessionType },
                    expected: { eid: eventId, cat: activeCategory, sess: sessionType }
                });
                return;
            }

            console.log('✅ [useChat] WS Message accepted');

            const rawUser = raw.user || raw.userId;
            const resolvedCategory = raw.category || activeCategory;

            const newMessage: Message & { category?: string } = {
                _id: raw._id || raw.id || `ws-${Date.now()}`,
                content: raw.content,
                createdAt: raw.createdAt || new Date().toISOString(),
                updatedAt: raw.updatedAt || new Date().toISOString(),
                userId: (rawUser && typeof rawUser === 'object') ? {
                    _id: String(rawUser._id || rawUser.id || raw.senderId || 'unknown'),
                    username: rawUser.username || rawUser.name || rawUser.displayName || raw.senderName || 'Guest',
                    email: rawUser.email || '',
                    avatar: rawUser.avatar || raw.senderAvatar,
                    role: rawUser.role || raw.role || 'Attendee'
                } : {
                    _id: String(raw.senderId || 'unknown'),
                    username: raw.senderName || 'Guest',
                    email: raw.email || '',
                    avatar: raw.senderAvatar,
                    role: raw.role || 'Attendee'
                },
                likes: raw.likes || [],
                comments: raw.comments || []
            };

            // Add category if not existing in type but needed for logic/tracking
            (newMessage as any).category = resolvedCategory;

            console.log('📥 [useChat] NEW MESSAGE via WS:', {
                id: newMessage._id,
                content: newMessage.content,
                sender: newMessage.userId.username,
                role: newMessage.userId.role,
                category: resolvedCategory
            });

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
                            String(m.userId?._id) === String(newMessage.userId?._id)
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
                role: userPayload.role
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
        // Rule 5: Send messages ONLY to active room. User is identified by backend via session.
        console.log('📤 [useChat] SENDING message:', {
            eventId,
            sessionType,
            category: activeCategory,
            content: content.substring(0, 20) + (content.length > 20 ? '...' : '')
        });

        emit('sendMessage', {
            eventId,
            content,
            sessionType,
            category: activeCategory,
            user: {
                _id: userPayload._id,
                name: userPayload.name,
                avatar: userPayload.avatar,
                role: userPayload.role
            }
        });

        // REST POST is REMOVED for sending to avoid redundancy
    }, [emit, eventId, sessionType, activeCategory, chatUser, userId, role, queryKey, queryClient]);

    return {
        messages,
        sendMessage,
        isLoading,
        isConnected,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        fetchPreviousPage,
        hasPreviousPage,
        isFetchingPreviousPage
    };
}
