import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { Message } from '@/lib/types/api';
import { useApiRequest } from '@/lib/useApiRequest';

export function useMessages(
  sessionType: ChatSessionType,
  eventId: string,
  category: ChatCategoryType,
  query?: Record<string, string | number>
) {
  const fullQuery = {
    sessionType,
    category,
    ...(query || {}),
  };

  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useApiRequest<{
    data: Message[];
  }>(
    () => apiClient.get(API_ROUTES.chat.history(eventId, fullQuery)),
    [eventId, sessionType, category, JSON.stringify(query)]
  );

  const messages = result?.data ?? [];

  const createMessage = async (content: string, userId?: string) => {
    const payload = {
      content,
      sessionType,
      category,
    };

    const newMessage = await apiClient.post(
      API_ROUTES.chat.create(eventId),
      payload
    );

    await refetch();
    return newMessage;
  };

  return { messages, isLoading, error, refetch, createMessage };
}
