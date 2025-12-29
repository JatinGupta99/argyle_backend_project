import { apiClient } from './api-client';
import { API_ROUTES } from './api-routes';
import { Event } from './types/components';

export async function getEvent(eventId: string): Promise<Event> {
    const response = await apiClient.get(API_ROUTES.event.fetchById(eventId));
    return response?.data ?? null;
}

export async function getEventDownloadUrl(eventId: string): Promise<string | null> {
    try {
        const response = await apiClient.get(
            API_ROUTES.event.getEventImageUrl(eventId)
        );

        if (typeof response === 'string') return response;

        if (typeof response === 'object' && response !== null) {
            // Check for url or data property at top level (unwrapped by apiClient)
            if ('url' in response && typeof (response as any).url === 'string') return (response as any).url;
            if ('data' in response && typeof (response as any).data === 'string') return (response as any).data;

            // Nested check just in case
            if ('data' in response && typeof (response as any).data === 'object' && (response as any).data !== null) {
                const nested = (response as any).data;
                if ('url' in nested && typeof nested.url === 'string') return nested.url;
                if ('data' in nested && typeof nested.data === 'string') return nested.data;
            }
        }

        return null;
    } catch (error) {
        console.error('[getEventDownloadUrl] fetch error:', error);
        return null;
    }
}
