'use client';

import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';
import { ROLEBASED } from '@/lib/types/daily';

// Re-export for backward compatibility
export { ROLEBASED };

export function useDailyBase(
  roomUrl: string,
  token: string | null,
  enable: boolean
) {
  const callObjectRef = useRef<DailyCall | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (callObjectRef.current) {
        callObjectRef.current.leave();
        callObjectRef.current.destroy();
        callObjectRef.current = null;
      }
    },
    []
  );

  useEffect(() => {
    if (!enable || !roomUrl) return;

    if (!callObjectRef.current) {
      const existing = DailyIframe.getCallInstance();
      if (existing) {
        callObjectRef.current = existing;
      } else {
        callObjectRef.current = DailyIframe.createCallObject({
          url: roomUrl,
          subscribeToTracksAutomatically: true,
        });
      }
    }
  }, [enable, roomUrl]);

  useEffect(() => {
    const callObject = callObjectRef.current;
    if (!enable || !callObject) return;

    callObject
      .join({ token: token ?? undefined })
      .then(() => setReady(true))
      .catch((err) => setError(err?.message || 'Unable to join'));

    return () => { };
  }, [enable, token]);

  return { callObject: callObjectRef.current, ready, error };
}
