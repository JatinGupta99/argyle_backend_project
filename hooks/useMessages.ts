import { apiClient } from '@/lib/api-client';
import { useApiRequest } from '@/lib/useApiRequest';
import { API_ROUTES } from '@/lib/api-routes';
import { Message } from '@/lib/types/api';

export function useMessages(eventId: string, query?: Record<string, string>) {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useApiRequest<Message[]>(
    () => apiClient.get(API_ROUTES.chat.history(eventId, query)),
    [eventId, JSON.stringify(query)]
  );

  const createMessage = async (userId: string, content: string) => {
    const newMessage = await apiClient.post(API_ROUTES.chat.create(), {
      userId,
      eventId,
      content,
    });
    await refetch();
    return newMessage;
  };

  return { messages, isLoading, error, refetch, createMessage };
}
