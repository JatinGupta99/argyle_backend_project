'use client';

import DailyIframe, { DailyCall, DailyCallOptions } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';

// Singleton for the app lifetime
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
  const userNameRef = useRef<string>(userName);
  const isJoiningRef = useRef(false);

  // Sync refs safely
  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  // 1. Singleton & event subscriptions
  useEffect(() => {
    const co = getOrCreateInstance();
    if (!co) return;

    setInstance(co);
    activeHooks++;
    console.log('[useDailyBase] Hook mounted. Active hooks:', activeHooks);

    const handleJoined = async () => {
      const roomInfo = await co.room();
      const currentRoomName = roomInfo && 'name' in roomInfo ? roomInfo.name : null;

      setReady(true);
      setError(null);
      isJoiningRef.current = false;

      // Duplicate-session ejection logic
      const participants = co.participants();
      const localId = participants.local?.session_id;
      const currentUserName = userNameRef.current;

      console.log('[useDailyBase] Checking for duplicate sessions for:', currentUserName);
      Object.values(participants).forEach((p: any) => {
        if (p.session_id !== localId && p.user_name === currentUserName) {
          console.warn('[useDailyBase] Found duplicate session for user, sending ejection request:', p.session_id);
          co.sendAppMessage({ type: 'duplicate-session', eject: true }, p.session_id);
        }
      });
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

    const handleAppMessage = (ev: any) => {
      console.log('[useDailyBase] App Message received:', ev);
      if (ev?.data?.type === 'duplicate-session' && ev?.data?.eject === true) {
        console.warn('[useDailyBase] Received ejection request due to duplicate session. Leaving...');
        co.leave();
      }
    };

    co.on('joined-meeting', handleJoined);
    co.on('left-meeting', handleLeft);
    co.on('error', handleError);
    co.on('app-message', handleAppMessage);

    return () => {
      activeHooks--;
      co.off('joined-meeting', handleJoined);
      co.off('left-meeting', handleLeft);
      co.off('error', handleError);
      co.off('app-message', handleAppMessage);

      // Only leave if no hooks are active and we aren't already left (Debounced for Strict Mode)
      setTimeout(() => {
        if (activeHooks <= 0 && co.meetingState() !== 'left-meeting' && co.meetingState() !== 'new') {
          console.log('[useDailyBase] No active hooks remaining, leaving meeting...');
          co.leave();
        }
      }, 200);
    };
  }, []);

  // 2. Join / leave / switch room logic
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
          // Check if the current room name is part of the requested URL (or always true if we trust the logic)
          inCorrectRoom = true;
        }


        console.log('[useDailyBase] DEBUG: Checking join conditions', {
          state,
          inCorrectRoom,
          targetUrl: roomUrl,
          hasToken: !!token,
        });

        // Already in the desired room
        if (inCorrectRoom) {
          console.log('[useDailyBase] DEBUG: Already in room, setting ready');
          setReady(true);
          setError(null);
          isJoiningRef.current = false;
          return;
        }

        // Switch rooms if needed
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
        // Only set error if not related to already joining (though we caught that earlier)
        setError(err?.errorMsg || err?.message || 'Join failed');
        setReady(false);
        isJoiningRef.current = false;
      }
    };

    joinRoom();
  }, [enable, roomUrl, userName, token]);

  // 3. Sync userName if it changes while joined
  useEffect(() => {
    const co = globalCallInstance;
    if (co && co.meetingState() === 'joined-meeting' && userName && co.participants().local?.user_name !== userName) {
      console.log('[useDailyBase] Syncing userName to Daily:', userName);
      co.setUserName(userName);
    }
  }, [userName]);

  return { callObject: instance, ready, error };
}
