'use client';

import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Singleton management                                               */
/* ------------------------------------------------------------------ */

let globalCallInstance: DailyCall | null = null;
let activeHooks = 0;

function getOrCreateCall(): DailyCall | null {
  if (typeof window === 'undefined') return null;

  if (!globalCallInstance) {
    console.log('[useDailyBase] Creating Daily singleton');
    globalCallInstance =
      DailyIframe.getCallInstance() ??
      DailyIframe.createCallObject({
        subscribeToTracksAutomatically: true,
      });
  }

  return globalCallInstance;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function sanitizeToken(token: unknown): string | undefined {
  if (typeof token !== 'string') return undefined;
  const trimmed = token.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return undefined;
  return trimmed;
}

function isJoined(call: DailyCall) {
  return call.meetingState() === 'joined-meeting';
}

function isJoining(call: DailyCall) {
  return call.meetingState() === 'joining-meeting';
}

async function leaveIfJoined(call: DailyCall) {
  if (isJoined(call)) {
    await call.leave();
  }
}

/* ------------------------------------------------------------------ */
/* Event handlers factory                                             */
/* ------------------------------------------------------------------ */

function createEventHandlers(
  call: DailyCall,
  {
    setReady,
    setError,
    userNameRef,
    isJoiningRef,
  }: {
    setReady: (v: boolean) => void;
    setError: (v: string | null) => void;
    userNameRef: React.MutableRefObject<string>;
    isJoiningRef: React.MutableRefObject<boolean>;
  }
) {
  const handleJoined = async () => {
    setReady(true);
    setError(null);
    isJoiningRef.current = false;

    const participants = call.participants();
    const local = participants.local;
    if (!local) return;

    const localId = local.session_id;
    const localUserData = (local as any).userData || {};
    const localIdentity = localUserData._id || localUserData.id || local.user_name;

    Object.values(participants).forEach((p: any) => {
      if (p.session_id === localId || p.local) return;

      const pUserData = p.userData || {};
      const pIdentity = pUserData._id || pUserData.id || p.user_name;

      if (pIdentity && pIdentity === localIdentity) {
        console.warn('[useDailyBase] Duplicate session detected on join. Ejecting old session:', p.session_id);
        call.sendAppMessage(
          { type: 'duplicate-session', eject: true, reason: 'Newer session joined' },
          p.session_id
        );
      }
    });
  };

  const handleParticipantJoined = (ev: any) => {
    const p = ev?.participant;
    if (!p || p.local) return;

    const local = call.participants().local;
    if (!local) return;

    const localUserData = (local as any).userData || {};
    const localIdentity = localUserData._id || localUserData.id || local.user_name;

    const pUserData = p.userData || {};
    const pIdentity = pUserData._id || pUserData.id || p.user_name;

    // If SOMEONE ELSE joins with my identity, I should probably yield? 
    // Actually, usually the NEWest one wins. The newcomer will send the eject message in their handleJoined.
  };

  const handleLeft = () => {
    setReady(false);
    isJoiningRef.current = false;
  };

  const handleError = (e: any) => {
    console.error('[useDailyBase] SDK error:', e);
    setError(e?.errorMsg || e?.message || 'Meeting error');
    setReady(false);
    isJoiningRef.current = false;
  };

  const handleAppMessage = (ev: any) => {
    if (ev?.data?.type === 'duplicate-session' && ev.data.eject) {
      console.warn('[useDailyBase] Duplicate session eject received');
      call.leave();
    }
  };

  return {
    handleJoined,
    handleLeft,
    handleError,
    handleAppMessage,
    handleParticipantJoined,
  };
}

/* ------------------------------------------------------------------ */
/* Hook                                                               */
/* ------------------------------------------------------------------ */

export function useDailyBase(
  roomUrl: string,
  enable: boolean,
  userName: string,
  token: string | null = null,
  userData: any = null,
  startWithMedia: boolean = true
) {
  const [call, setCall] = useState<DailyCall | null>(getOrCreateCall());
  const [ready, setReady] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const userNameRef = useRef(userName);
  const isJoiningRef = useRef(false);

  /* Sync refs */
  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  /* Singleton + events lifecycle */
  useEffect(() => {
    const co = getOrCreateCall();
    if (!co) return;

    setCall(co);
    activeHooks++;

    const handlers = createEventHandlers(co, {
      setReady,
      setError,
      userNameRef,
      isJoiningRef,
    });

    co.on('joined-meeting', handlers.handleJoined);
    co.on('left-meeting', handlers.handleLeft);
    co.on('error', handlers.handleError);
    co.on('app-message', handlers.handleAppMessage);
    co.on('participant-joined', handlers.handleParticipantJoined);

    return () => {
      activeHooks--;

      co.off('joined-meeting', handlers.handleJoined);
      co.off('left-meeting', handlers.handleLeft);
      co.off('error', handlers.handleError);
      co.off('app-message', handlers.handleAppMessage);
      co.off('participant-joined', handlers.handleParticipantJoined);

      setTimeout(() => {
        if (activeHooks <= 0 && !['left-meeting', 'new'].includes(co.meetingState())) {
          console.warn('[useDailyBase] Leaving room because activeHooks is 0', {
            activeHooks,
            meetingState: co.meetingState()
          });
          co.leave();
        }
      }, 200);
    };
  }, []);

  /* Join / switch room */
  useEffect(() => {
    const co = globalCallInstance;
    if (!co || !enable || !roomUrl) return;
    if (isJoiningRef.current || isJoining(co)) return;

    const join = async () => {
      try {
        isJoiningRef.current = true;

        if (isJoined(co)) {
          setReady(true);
          setError(null);
          isJoiningRef.current = false;
          return;
        }

        await leaveIfJoined(co);

        await co.join({
          url: roomUrl,
          userName,
          userData,
          token: sanitizeToken(token),
          activeSpeakerMode: true,
          customLayout: true,
          showLeaveButton: false,
          startVideoOff: !startWithMedia,
          startAudioOff: !startWithMedia
        });
      } catch (e: any) {
        console.error('[useDailyBase] Join failed:', e);
        setError(e?.errorMsg || e?.message || 'Join failed');
        setReady(false);
        isJoiningRef.current = false;
      }
    };

    join();
  }, [enable, roomUrl, token, JSON.stringify(userData)]);

  /* Sync username */
  useEffect(() => {
    const co = globalCallInstance;
    if (!co || !isJoined(co)) return;

    if (co.participants().local?.user_name !== userName) {
      console.log('[useDailyBase] Correcting username to:', userName);
      co.setUserName(userName);
    }
  }, [userName, ready]);

  return { callObject: call, ready, error };
}
