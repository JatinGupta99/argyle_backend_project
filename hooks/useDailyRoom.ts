'use client';

import { useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyRoomUrl } from '@/lib/constants/api';

interface UseDailyRoomOptions {
  roomUrl: string;
}

export function useDailyRoom({ roomUrl }: UseDailyRoomOptions) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const call = DailyIframe.createCallObject();
    setCallObject(call);

    async function joinRoom() {
      try {
        await call.join({ url: DailyRoomUrl });
      } catch (err: any) {
        console.error('Join error:', err);
        if (typeof err === 'string') {
          setError(err);
        } else if (err?.error === 'account-missing-payment-method') {
          setError('Your Daily account is missing a payment method.');
        } else if (err?.message) {
          setError(err.message);
        } else {
          setError('Unknown error occurred while joining the room.');
        }
      }
    }

    joinRoom();

    return () => {
      call.leave().catch(() => {});
      call.destroy();
    };
  }, [roomUrl]);

  return { callObject, error };
}
