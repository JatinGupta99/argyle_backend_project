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

export function useDailyRoomConnector(eventId: string): UseDailyRoomResult {
  const userId = UserID;
  const { event, isLoading: isEventLoading, error: eventError } = useEvent(eventId);

  const roomUrl = useMemo(() => event?.dailyRoomDetails?.dailyRoomUrl, [event]);
  const eventTitle = event?.title || null;
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [dailyStatus, setDailyStatus] = useState<'idle' | 'joining' | 'ready' | 'error'>('idle');
  const [dailyError, setDailyError] = useState<string | null>(null);

  const loading = isEventLoading || dailyStatus === 'joining';
  const isRoomReady = dailyStatus === 'ready' && !!callObject;
  const finalError = eventError ? eventError : dailyError;

  // Create call object once
  useEffect(() => {
    const co = DailyIframe.createCallObject();
    setCallObject(co);
    console.log('[Daily] Call object created');

    return () => {
      console.log('[Daily] Destroying call object');
      co.destroy();
    };
  }, []);

  useEffect(() => {
    if (!callObject || isEventLoading || !roomUrl) return;

    const handleJoined = () => {
      console.log('[Daily] joined-meeting fired ✅');
      setDailyStatus('ready');
    };
    const handleError = (err: any) => {
      console.error('[Daily] error:', err);
      setDailyError(err?.errorMsg || err?.message || 'Daily error');
      setDailyStatus('error');
    };

    callObject.on('joined-meeting', handleJoined);
    callObject.on('error', handleError);

    console.log('[Daily] joining room', roomUrl);
    setDailyStatus('joining');

    callObject
      .join({ url: roomUrl, userName: userId || 'Guest' })
      .catch((err) => {
        console.error('[Daily] join() rejected', err);
        setDailyError(err?.errorMsg || 'Failed to join meeting');
        setDailyStatus('error');
      });

    return () => {
      console.log('[Daily] leaving meeting...');
      callObject.off('joined-meeting', handleJoined);
      callObject.off('error', handleError);
      callObject.leave().catch(() => {});
    };
  }, [callObject, roomUrl, userId, isEventLoading]);

  useEffect(() => {
  }, [eventId, roomUrl, dailyStatus, isRoomReady, loading, eventError]);

  return {
    callObject,
    loading,
    error: finalError,
    isRoomReady,
    eventTitle,
    eventError
  };
}
