import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { Event } from '@/lib/types/components';
import { useApiRequest } from '@/lib/useApiRequest';

export function useEvent(eventId: string) {
  const { data, isLoading, error, refetch } = useApiRequest(
    () => apiClient.get(API_ROUTES.event.fetchById(eventId)),
    [eventId]
  );
  console.log(data, 'aclsnlsacn')
  const event: Partial<Event> | null = isLoading ? null : (data ?? null);

  console.log(event, 'event');

  return {
    event,
    isLoading,
    error,
    refetch,
  };
}
