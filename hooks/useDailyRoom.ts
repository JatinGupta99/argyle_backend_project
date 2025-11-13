'use client';
import { useEffect, useMemo, useState } from 'react';
import DailyIframe, { type DailyCall } from '@daily-co/daily-js';
import { useEvent } from '@/hooks/useEvents';
import { UserID } from '@/lib/constants/api';

interface UseDailyRoomResult {
  callObject: DailyCall | null;
  loading: boolean;
  error: string | null;
  isRoomReady: boolean;
  eventTitle: string | null;
  eventError: Error | null;
}

export function useDailyRoomConnector(event: Event): UseDailyRoomResult {
  const userId = UserID;
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [dailyStatus, setDailyStatus] = useState<
    'idle' | 'joining' | 'ready' | 'error'
  >('idle');
  const [dailyError, setDailyError] = useState<string | null>(null);

  const loading = isEventLoading || dailyStatus === 'joining';
  const isRoomReady = dailyStatus === 'ready' && !!callObject;
  const finalError = eventError ? eventError : dailyError;

  // Create call object once
  useEffect(() => {
    const co = DailyIframe.createCallObject();
    setCallObject(co);

    return () => {
      co.destroy();
    };
  }, []);

  useEffect(() => {
    if (!callObject || isEventLoading || !roomUrl) return;

    const handleJoined = () => {
      setDailyStatus('ready');
    };
    const handleError = (err: any) => {
      console.error('[Daily] error:', err);
      setDailyError(err?.errorMsg || err?.message || 'Daily error');
      setDailyStatus('error');
    };

    callObject.on('joined-meeting', handleJoined);
    callObject.on('error', handleError);

    setDailyStatus('joining');

    callObject
      .join({ url: roomUrl, userName: userId || 'Guest' })
      .catch((err) => {
        console.error('[Daily] join() rejected', err);
        setDailyError(err?.errorMsg || 'Failed to join meeting');
        setDailyStatus('error');
      });

    return () => {
      callObject.off('joined-meeting', handleJoined);
      callObject.off('error', handleError);
      callObject.leave().catch(() => {});
    };
  }, [callObject, roomUrl, userId, isEventLoading]);

  useEffect(() => {}, [
    eventId,
    roomUrl,
    dailyStatus,
    isRoomReady,
    loading,
    eventError,
  ]);

  return {
    callObject,
    loading,
    error: finalError,
    isRoomReady,
    eventTitle,
    eventError,
  };
}
