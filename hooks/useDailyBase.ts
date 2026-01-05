'use client';

import DailyIframe, { DailyCall, DailyCallOptions } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';
let globalCallInstance: DailyCall | null = null;
let activeHooks = 0;

const getOrCreateInstance = (): DailyCall | null => {
  if (typeof window === 'undefined') return null;
  if (!globalCallInstance) {
    console.log('[useDailyBase] Initializing Daily Singleton');
    globalCallInstance = DailyIframe.getCallInstance() || DailyIframe.createCallObject({
      subscribeToTracksAutomatically: true,
    });
  }
  return globalCallInstance;
};

export function useDailyBase(
  roomUrl: string,
  enable: boolean,
  userName: string,
  token: string | null = null
) {
  const [instance, setInstance] = useState<DailyCall | null>(getOrCreateInstance());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentRoomUrlRef = useRef<string | null>(null);
  const isJoiningRef = useRef(false);
  useEffect(() => {
    const co = getOrCreateInstance();
    if (!co) return;

    setInstance(co);
    activeHooks++;
    console.log('[useDailyBase] Hook mounted. Active hooks:', activeHooks);

    const handleJoined = async () => {
      const roomInfo = await co.room();
      const currentRoomName = roomInfo && 'name' in roomInfo ? roomInfo.name : null;

      console.log('[useDailyBase] Joined meeting event:', { currentRoomName, intendedUrl: currentRoomUrlRef.current });
      if (currentRoomName && currentRoomUrlRef.current?.includes(currentRoomName)) {
        setReady(true);
        setError(null);
      } else if (!currentRoomUrlRef.current) {
        setReady(true);
      }
      isJoiningRef.current = false;
    };

    const handleLeft = () => {
      setReady(false);
      isJoiningRef.current = false;
    };

    const handleError = (e: any) => {
      console.error('[useDailyBase] SDK Error:', e);
      setError(e?.errorMsg || e?.message || 'Meeting error');
      setReady(false);
      isJoiningRef.current = false;
    };

    co.on('joined-meeting', handleJoined);
    co.on('left-meeting', handleLeft);
    co.on('error', handleError);

    return () => {
      activeHooks--;
      co.off('joined-meeting', handleJoined);
      co.off('left-meeting', handleLeft);
      co.off('error', handleError);
      setTimeout(() => {
        if (activeHooks <= 0 && co.meetingState() !== 'left-meeting' && co.meetingState() !== 'new') {
          console.log('[useDailyBase] No active hooks remaining, leaving meeting...');
          co.leave();
        }
      }, 200);
    };
  }, []);
  useEffect(() => {
    const co = globalCallInstance;
    if (!co || !enable || !roomUrl) return;

    currentRoomUrlRef.current = roomUrl;

    const joinRoom = async () => {
      if (isJoiningRef.current) return;
      isJoiningRef.current = true;

      try {
        const state = co.meetingState();
        if (state === 'joining-meeting') {
          console.log('[useDailyBase] Already joining-meeting, waiting for event...');
          return;
        }

        console.log('[useDailyBase] DEBUG: Checking join conditions', { state });
        let inCorrectRoom = false;
        if (state === 'joined-meeting') {
          const room = await co.room();
          console.log('[useDailyBase] DEBUG: Checking join conditions', { room });
          inCorrectRoom = true;
        }

        console.log('[useDailyBase] DEBUG: Checking join conditions', {
          state,
          inCorrectRoom,
          targetUrl: roomUrl,
          hasToken: !!token,
        });
        if (inCorrectRoom) {
          console.log('[useDailyBase] DEBUG: Already in room, ready');
          setReady(true);
          isJoiningRef.current = false;
          return;
        }
        if (state === 'joined-meeting' && !inCorrectRoom) {
          console.log('[useDailyBase] Leaving current room to join a new one');
          await co.leave();
        }

        console.log('[useDailyBase] Joining room:', { roomUrl, userName, tokenUrl: token });
        const joinOptions: DailyCallOptions = {
          url: roomUrl,
          userName,
          token: token || undefined,
          activeSpeakerMode: true,
          customLayout: true,
          showLeaveButton: false,
        };
        console.log('[useDailyBase] calling co.join with options:', joinOptions);

        const result = await co.join(joinOptions);
        console.log('[useDailyBase] join result:', result);
        return result;
      } catch (err: any) {
        console.error('[useDailyBase] join error:', err);
        setError(err?.errorMsg || err?.message || 'Join failed');
        setReady(false);
        isJoiningRef.current = false;
      }
    };

    joinRoom();
  }, [enable, roomUrl, userName, token]);

  return { callObject: instance, ready, error };
}
