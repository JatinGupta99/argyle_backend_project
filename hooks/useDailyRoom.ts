'use client';

import { useEffect, useState } from 'react';
import DailyIframe, { type DailyCall } from '@daily-co/daily-js';

interface UseDailyRoomOptions {
  roomUrl: string;
}

export function useDailyRoom({ roomUrl }: UseDailyRoomOptions) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomUrl) {
      setError('Missing room URL');
      setLoading(false);
      return;
    }

    const call = DailyIframe.createCallObject();
    setCallObject(call);

    async function joinRoom() {
      try {
        setLoading(true);
        await call.join({ url: roomUrl });
        setLoading(false);
      } catch (err: any) {
        console.error('Error joining Daily room:', err);
        setError(err?.message || 'Failed to join Daily room');
        setLoading(false);
      }
    }

    joinRoom();

    // Cleanup when component unmounts
    return () => {
      call.leave().catch(() => {});
      call.destroy();
    };
  }, [roomUrl]);

  return { callObject, loading, error };
}
