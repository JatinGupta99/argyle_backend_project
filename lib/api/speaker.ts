import { useAuth } from '@/app/auth/auth-context';
import { } from '@/lib/constants/api';

export async function toggleLiveState(
  eventId: string,
  isLive: boolean,
  userId: string
): Promise<boolean> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/events/${eventId}/live`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLive, userId }),
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
