import { apiClient } from "./api-client";
import { API_ROUTES } from "./api-routes";
import { EventId } from "./constants/api";


export interface Sponsor {
  _id: string;
  name: string;
  imageUrl: string;
}

export async function getSponsors(eventId: string = EventId): Promise<Sponsor[]> {
  const response = await apiClient.get(API_ROUTES.sponsor.fetchALL(eventId));
  return response?.data.results ?? [];
}
