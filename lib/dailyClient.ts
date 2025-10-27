'use client';

import { useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

interface UseDailyRoomResult {
  callObject: DailyCall | null;
  roomUrl: string;
  loading: boolean;
  error: string | null;
}

/**
 * Hook: handles all Daily video room logic.
 * Later, replace hardcoded room URL with API-based fetch.
 */
export function useDailyRoom(eventId: string): UseDailyRoomResult {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [roomUrl] = useState(
    'https://jatinguptawork.daily.co/IYgdOmH87NbECz55EZ3t'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const co = DailyIframe.createCallObject();
    setCallObject(co);

    return () => {
      co.destroy();
    };
  }, []);

  useEffect(() => {
    if (!callObject) return;

    async function joinRoom() {
      try {
        setLoading(true);
        await callObject.join({ url: roomUrl });
      } catch (err) {
        console.error('Join error:', err);
        setError('Failed to join meeting');
      } finally {
        setLoading(false);
      }
    }

    joinRoom();
  }, [callObject, roomUrl, eventId]);

  return { callObject, roomUrl, loading, error };
}
