import { apiClient } from '@/lib/api-client';
import { useApiRequest } from '@/lib/useApiRequest';
import { API_ROUTES } from '@/lib/api-routes';
import { Message } from '@/lib/types/api';
import { ChatType } from '@/lib/constants/chat';

export function useMessages(
  type: ChatType,
  eventId: string,
  query?: Record<string, string>
) {
  const fullQuery = { ...(query || {}), type };
  const { data:Result, isLoading, error, refetch } = useApiRequest<{
    data: {
      data: Message[];
    };
  }>(
    () => apiClient.get(API_ROUTES.chat.history(eventId, fullQuery)),
    [eventId, type, JSON.stringify(query)]
  );
  const messages = Result?.data ?? [];

  const createMessage = async (content: string) => {
     console.log(eventId,'eventIDddd')
    const newMessage = await apiClient.post(API_ROUTES.chat.create(eventId), {
      content,
      type,
    });
    await refetch();
    return newMessage;
  };

  return { messages, isLoading, error, refetch, createMessage };
}
