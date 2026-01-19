import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { Message } from '@/lib/types/api';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useAuth } from '@/app/auth/auth-context';

export function useMessages(
  sessionType: ChatSessionType,
  eventId: string,
  category: ChatCategoryType,
  query?: Record<string, string | number>
) {
  const queryClient = useQueryClient();
  const { userId: authUserId, role: authRole } = useAuth();
  const currentUser = useSelector((state: RootState) => state.user);
  const queryKey = ['messages', eventId, sessionType, category, JSON.stringify(query)];

  const fetchMessages = async ({ pageParam }: { pageParam?: { before?: string; after?: string } }) => {
    const fullQuery: Record<string, any> = {
      sessionType,
      category,
      limit: 50,
      ...(query || {}),
    };

    if (pageParam?.before) fullQuery.before = pageParam.before;
    if (pageParam?.after) fullQuery.after = pageParam.after;

    const response = await apiClient.get<Message[]>(
      API_ROUTES.chat.history(eventId, fullQuery)
    );

    // Ensure we always return an array
    const data = (Array.isArray(response) ? response : (response as any).data) ?? [];
    return data as Message[];
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    error,
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
  });



  const messages = data?.pages.flatMap((page) => page) ?? [];

  const createMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const payload = {
        content,
        sessionType,
        category,
        userId: authUserId || currentUser?.id,
      };

      return apiClient.post<Message>(API_ROUTES.chat.create(eventId), payload);
    },
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<InfiniteData<Message[]>>(queryKey);

      const optimisticMessage: Message = {
        _id: `temp-${Date.now()}`,
        content,
        userId: {
          _id: authUserId || currentUser?.id || 'me',
          username: currentUser?.name || 'Me',
          email: currentUser?.email || '',
          avatar: '',
          role: authRole || 'Attendee'
        },
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        updatedAt: new Date().toISOString()
      };

      queryClient.setQueryData<InfiniteData<Message[]>>(queryKey, (oldData) => {
        if (!oldData) {
          return {
            pages: [[optimisticMessage]],
            pageParams: [undefined],
          };
        }

        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = [optimisticMessage, ...newPages[0]];
        } else {
          newPages[0] = [optimisticMessage];
        }

        return {
          ...oldData,
          pages: newPages,
        };
      });

      return { previousMessages };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKey, context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    messages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    createMessage: createMessageMutation.mutateAsync,
    isSending: createMessageMutation.isPending
  };
}
