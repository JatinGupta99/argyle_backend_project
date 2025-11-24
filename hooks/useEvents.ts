import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { Event } from '@/lib/types/components';
import { useApiRequest } from '@/lib/useApiRequest';

export function useEvent(eventId: string) {
  const { data, isLoading, error, refetch } = useApiRequest<{ data: Event }>(
    () => apiClient.get(API_ROUTES.event.fetchById(eventId)),
    [eventId]
  );
  console.log(data,'csanlcks')
  const event: Event | undefined = data?.data;
  return {
    event,
    isLoading,
    error,
    refetch,
  };
}
