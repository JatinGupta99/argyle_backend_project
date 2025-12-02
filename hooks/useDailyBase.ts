'use client';

import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';

export enum ROLEBASED {
  ATTENDEE = 'attendee',
  SPEAKER = 'speaker',
  MODERATOR = 'moderator',
}

export function useDailyBase(
  roomUrl: string,
  userName: string,
  role: ROLEBASED,
  enableDaily: boolean
): any {
  const callObjectRef = useRef<DailyCall | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track component mount to prevent state updates on unmount
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  // ---------------------------------------------------------------------------
  // 1) CREATE SINGLETON DAILY CALL OBJECT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!enableDaily || !roomUrl) return;

    if (!callObjectRef.current) {
      const existing = DailyIframe.getCallInstance();
      if (existing) {
        callObjectRef.current = existing;
      } else {
        callObjectRef.current = DailyIframe.createCallObject({
          url: roomUrl,
          subscribeToTracksAutomatically: true,
          startAudioOff: true,
          startVideoOff: true,
        });
      }
    }

    return () => {
      // Leave meeting and cleanup on unmount
      if (callObjectRef.current) {
        callObjectRef.current.leave();
        callObjectRef.current.destroy();
        callObjectRef.current = null;
      }
    };
  }, [enableDaily, roomUrl]);

  // ---------------------------------------------------------------------------
  // 2) JOIN MEETING SAFELY
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const callObject = callObjectRef.current;
    if (!enableDaily || !callObject) return;

    const meetingState = callObject.meetingState();
    if (meetingState === 'joined-meeting') {
      setReady(true);
      return;
    }

    const onJoined = () => mounted.current && setReady(true);
    const onError = (e: any) =>
      mounted.current && setError(e?.errorMsg || 'Daily error');

    callObject.on('joined-meeting', onJoined);
    callObject.on('error', onError);

    if (meetingState === 'new' || meetingState === 'left-meeting') {
      callObject
        .join({
          userName,
          audioSource: role !== ROLEBASED.ATTENDEE,
          videoSource: role !== ROLEBASED.ATTENDEE,
          userData: { role },
        })
        .catch(
          (err) => mounted.current && setError(err?.message || 'Join failed')
        );
    }

    return () => {
      callObject.off('joined-meeting', onJoined);
      callObject.off('error', onError);
    };
  }, [enableDaily, role, userName]);

  return { callObject: callObjectRef.current, ready, error };
}
