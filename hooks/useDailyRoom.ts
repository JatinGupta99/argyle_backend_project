'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Event } from '@/lib/types/components';
import { UserID } from '@/lib/constants/api';

let _dailySingleton: DailyCall | null = null;

export function useDailyRoomConnector(event: Event) {
  const roomUrl = event?.dailyRoomDetails?.dailyRoomUrl;
  const userId = UserID;

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [status, setStatus] = useState<'idle' | 'joining' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!_dailySingleton) {
      _dailySingleton = DailyIframe.createCallObject({
        subscribeToTracksAutomatically: true,
      });
    }

    setCallObject(_dailySingleton);

    return () => {
      // NEVER destroy here – React StrictMode will remount
      // _dailySingleton?.destroy();
    };
  }, []);

  const bindDailyEvents = useCallback(
    (co: DailyCall) => {
      const handleJoined = () => setStatus('ready');

      const handleError = (err: any) => {
        const message =
          err?.errorMsg || err?.message || 'Unexpected Daily error occurred';
        console.error('[Daily] Error:', message);
        setError(message);
        setStatus('error');
      };

      co.on('joined-meeting', handleJoined);
      co.on('error', handleError);

      return () => {
        co.off('joined-meeting', handleJoined);
        co.off('error', handleError);
      };
    },
    []
  );

  useEffect(() => {
    if (!callObject || !roomUrl || !userId) return;

    setStatus('joining');

    const cleanupEvents = bindDailyEvents(callObject);

    callObject
      .join({ url: roomUrl, userName: userId })
      .catch((err) => {
        console.error('[Daily] join() failed:', err);
        setError(err?.message || 'Failed to join Daily room');
        setStatus('error');
      });

    return () => {
      cleanupEvents();

      // ⚠ Leaving is SAFE but destroying is NOT recommended inside hooks.
      callObject.leave().catch(() => {});
    };
  }, [callObject, roomUrl, userId, bindDailyEvents]);

  return {
    callObject,
    loading: status === 'joining',
    isRoomReady: status === 'ready',
    error,
  };
}
