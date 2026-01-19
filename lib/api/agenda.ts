import { API_ROUTES } from '../api-routes';
import { apiClient } from '../api-client';

import { Agenda } from '../types/components';

export async function fetchAgendas(eventId: string, page: number = 1, limit: number = 20): Promise<Agenda[]> {
    const response = await apiClient.get(API_ROUTES.agenda.fetchAll(eventId, { page, limit }));
    return Array.isArray(response) ? response : [];
}

export async function fetchAgendaById(eventId: string, agendaId: string): Promise<Agenda | null> {
    const response = await apiClient.get(API_ROUTES.agenda.fetchById(eventId, agendaId));
    return response || null;
}
