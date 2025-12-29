import { apiClient } from './api-client';
import { API_ROUTES } from './api-routes';
import { Event } from './types/components';

export async function getEvent(eventId: string): Promise<Event> {
    const response = await apiClient.get(API_ROUTES.event.fetchById(eventId));
    return response?.data ?? null;
}

export async function getEventDownloadUrl(eventId: string): Promise<string> {
    const response = await apiClient.get(
        API_ROUTES.event.getEventImageUrl(eventId)
    );
    // Safely extract the URL whether validation returns a string or an object with data/url property
    if (typeof response === 'string') return response;
    if (typeof response === 'object' && response !== null) {
        if ('data' in response) return (response as any).data;
        if ('url' in response) return (response as any).url;
    }

    return response as unknown as string;
}
