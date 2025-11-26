import { apiClient } from './api-client';
import { API_ROUTES } from './api-routes';
export interface Sponsor {
  _id: string;
  name: string;
  description?: string;
  logoKey: string;
  socialMedia?: SocialLink[];
  documents?: DocumentLink[];
  websiteUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
}
export interface SocialLink {
  platform: string;
  icon: React.ReactNode;
  url?: string;
}

interface DocumentLink {
  id: string;
  icon: React.ReactNode;
  url?: string;
}

export async function getSponsors(eventId: string): Promise<Sponsor[]> {
  const response = await apiClient.get(API_ROUTES.sponsor.fetchALL(eventId));
  return response?.data.results ?? [];
}

export async function getDetailedSponsors(
  eventId: string,
  sponsorId: string
): Promise<{ statusCode: string; message: string; data: Sponsor[] }> {
  const response = await apiClient.get(
    API_ROUTES.sponsor.fetchById(eventId, sponsorId)
  );
  return response?.data ?? [];
}
