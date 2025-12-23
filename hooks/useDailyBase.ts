'use client';

import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';
import { ROLEBASED } from '@/lib/types/daily';
export { ROLEBASED };

export function useDailyBase(
  roomUrl: string,
  enable: boolean,
  userName: string,
  token: string | null = null
) {
  const callObjectRef = useRef<DailyCall | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enable || !roomUrl) return;

    let co = callObjectRef.current;
    if (!co) {
      co = DailyIframe.getCallInstance() || null;
      if (!co) {
        co = DailyIframe.createCallObject({
          url: roomUrl,
          subscribeToTracksAutomatically: true,
        });
      }
      callObjectRef.current = co;
    }

    let isMounted = true;

    const joinRoom = async () => {
      if (!co) return;

      try {
        const state = co.meetingState();
        if (state === 'joined-meeting' || state === 'joining-meeting') {
          if (isMounted) setReady(true);
          return;
        }

        const joinOptions: any = {
          url: roomUrl,
          userName: userName,
        };

        if (token) {
          joinOptions.token = token;
        }

        await co.join(joinOptions);

        if (isMounted) setReady(true);
      } catch (err: any) {
        console.error('Daily join failed:', err);
        let msg = err?.errorMsg || err?.message || 'Unable to join';

        if (typeof msg === 'object') {
          msg = JSON.stringify(msg);
        }

        if (msg.includes('does not exist')) {
          msg = 'The meeting room could not be found. It may have ended or the URL is incorrect.';
        }

        if (isMounted) setError(msg);
      }
    };

    joinRoom();

    return () => {
      isMounted = false;
      if (callObjectRef.current) {
        callObjectRef.current.leave();
        callObjectRef.current.destroy();
        callObjectRef.current = null;
        setReady(false);
      }
    };
  }, [enable, roomUrl, userName, token]);

  return { callObject: callObjectRef.current, ready, error };
}
