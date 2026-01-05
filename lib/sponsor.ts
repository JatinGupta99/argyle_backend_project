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
  youtubeUrl?: string;
  facebookUrl?: string;
  meetingLink?: string;
  calendlyLink?: string;
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
  const result = await apiClient.get(API_ROUTES.sponsor.fetchALL(eventId));
  console.log(result, 'result')
  return result;
}

export async function getDetailedSponsors(
  eventId: string,
  sponsorId: string
): Promise<Sponsor> {
  const response = await apiClient.get(
    API_ROUTES.sponsor.fetchById(eventId, sponsorId)
  );
  return (response as unknown as Sponsor) ?? null;
}

export async function getSponsorDownloadUrl(
  eventId: string,
  sponsorId: string
): Promise<string> {
  const response = await apiClient.get(
    API_ROUTES.sponsor.getSponsorImageReadUrl(eventId, sponsorId)
  );
  if (typeof response === 'string') return response;
  if (typeof response === 'object' && response !== null) {
    if ('data' in response) return (response as any).data;
    if ('url' in response) return (response as any).url;
  }

  return response as unknown as string;
}
