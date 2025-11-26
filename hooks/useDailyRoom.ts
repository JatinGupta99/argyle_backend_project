'use client';
import { useEffect, useState, useCallback } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Event } from '@/lib/types/components';
import { UserID } from '@/lib/constants/api';

let dailySingleton: DailyCall | null = null;

export function useDailyRoomConnector(event: Event) {
  const roomUrl = event?.dailyRoomDetails?.dailyRoomUrl;
  const userId = UserID;

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [status, setStatus] = useState<'idle' | 'joining' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!roomUrl) return;

    if (!dailySingleton) {
      dailySingleton = DailyIframe.createCallObject({
        audioSource: false,      
        videoSource: false,   
        subscribeToTracksAutomatically: true,
        customLayout: true,
      });
    }

    setCallObject(dailySingleton);

    return () => {
      // Leave safely on unmount
      dailySingleton?.leave().catch(() => {});
    };
  }, [roomUrl]);

  const bindEvents = useCallback((co: DailyCall) => {
    const handleJoined = () => setStatus('ready');
    const handleError = (err: any) => {
      console.error('[Daily] Error:', err?.message || err);
      setError(err?.message || 'Unexpected Daily error occurred');
      setStatus('error');
    };

    co.on('joined-meeting', handleJoined);
    co.on('error', handleError);

    return () => {
      co.off('joined-meeting', handleJoined);
      co.off('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (!callObject || !roomUrl || !userId) return;

    setStatus('joining');
    const cleanup = bindEvents(callObject);

    callObject
      .join({
        url: roomUrl,
        userName: userId,
        startAudioOff: true,
        startVideoOff: true,
        userData: { role: 'attendee' },
      })
      .catch((err) => {
        console.error('[Daily] join() failed:', err);
        setError(err?.message || 'Failed to join Daily room');
        setStatus('error');
      });

    return cleanup;
  }, [callObject, roomUrl, userId, bindEvents]);

  return { callObject, loading: status === 'joining', isRoomReady: status === 'ready', error };
}
