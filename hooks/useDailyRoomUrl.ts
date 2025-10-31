'use client';

import { useEffect, useState } from 'react';

interface UseDailyRoomUrlResult {
  roomUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function useDailyRoomUrl(eventId: string): UseDailyRoomUrlResult {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError('Missing event ID');
      setLoading(false);
      return;
    }

    const fetchRoomUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/events/${eventId}/room`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch room URL for event ${eventId}`);
        }

        const data = await res.json();

        if (!data.roomUrl) {
          throw new Error('Room URL missing from API response');
        }

        setRoomUrl(data.roomUrl);
      } catch (err: any) {
        console.error('useDailyRoomUrl error:', err);
        setError(err.message || 'Error fetching room URL');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomUrl();
  }, [eventId]);

  return { roomUrl, loading, error };
}
