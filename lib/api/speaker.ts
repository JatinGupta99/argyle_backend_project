import { UserID } from '@/lib/constants/api';

export async function toggleLiveState(
  eventId: string,
  isLive: boolean
): Promise<boolean> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http:
    const res = await fetch(`${apiUrl}/events/${eventId}/live`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLive, userId: UserID }),
    });

    if (!res.ok) {
      throw new Error('Failed to update live state');
    }

    return true;
  } catch (error: any) {
    console.error('Error toggling live state:', error);
    throw new Error(error.message || 'Failed to toggle live state');
  }
}
