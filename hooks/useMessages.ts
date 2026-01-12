import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { Message } from '@/lib/types/api';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

export function useMessages(
  sessionType: ChatSessionType,
  eventId: string,
  category: ChatCategoryType,
  query?: Record<string, string | number>
) {
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.user);
  const queryKey = ['messages', eventId, sessionType, category, JSON.stringify(query)];

  const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
    const fullQuery: Record<string, any> = {
      sessionType,
      category,
      limit: 50,
      ...(query || {}),
    };

    if (pageParam) {
      fullQuery.before = pageParam;
    }

    const response = await apiClient.get<{ data: Message[] }>(
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
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetchMessages,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // If we have fewer than 50 messages, we likely reached the end of history
      if (!lastPage || lastPage.length < 50) return undefined;
      // Use the createdAt of the oldest message in the current set as the cursor
      // Assuming messages are returned newest first or we can find the min date
      const oldestDate = lastPage.reduce((min, m) =>
        new Date(m.createdAt).getTime() < new Date(min).getTime() ? m.createdAt : min
        , lastPage[0].createdAt);

      return oldestDate;
    },
  });



  const messages = data?.pages.flatMap((page) => page) ?? [];

  const createMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const payload = {
        content,
        sessionType,
        category,
        userId: currentUser?.id,
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
          _id: currentUser?.id || 'me',
          username: currentUser?.name || 'Me',
          email: currentUser?.email || '',
          avatar: ''
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
    isFetchingNextPage,
    createMessage: createMessageMutation.mutateAsync,
    isSending: createMessageMutation.isPending
  };
}
