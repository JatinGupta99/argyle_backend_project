'use client';

import { normalizeRole } from '@/app/auth/access';
import { Role } from '@/app/auth/roles';
import { useCountdown } from '@/hooks/useCountdown';
import { useDailySpeaker } from '@/hooks/useDailySpeaker';
import { DailyAudio, DailyProvider } from '@daily-co/daily-react';
import { useEffect, useState, useMemo } from 'react';
import { getEventTimingStatus } from '@/lib/utils/event-timing';
import { useEventContext } from '../providers/EventContextProvider';
import { SpeakerStatusDisplay } from './SpeakerStatusDisplay';
import { SpeakerLobby } from './SpeakerLobby';
import { SpeakerStage } from './SpeakerStage';
import { useStageContext } from '../providers/StageContext';

interface SpeakerViewContentProps {
  eventId: string;
  roomUrl: string;
  role?: Role;
  userName?: string;
  token?: string | null;
  initialIsLive?: boolean;
  startTime?: Date;
}

export function SpeakerViewContent({
  eventId,
  roomUrl,
  role: initialRole,
  userName,
  token,
  initialIsLive = false,
  startTime,
}: SpeakerViewContentProps) {
  const [hasJoined, setHasJoined] = useState(false);
  const [hasBeenLive, setHasBeenLive] = useState(false);

  const { setBroadcastLive } = useStageContext();

  const event = useEventContext();
  const timing = useMemo(() => getEventTimingStatus(event as any), [event]);

  const [isTimeReached, setIsTimeReached] = useState<boolean>(timing.isPastStart);
  const [canJoinWindow, setCanJoinWindow] = useState<boolean>(timing.canJoinEarly);

  useEffect(() => {
    setIsTimeReached(timing.isPastStart);
    setCanJoinWindow(timing.canJoinEarly);
  }, [timing]);

  useEffect(() => {
    const interval = setInterval(() => {
      const t = getEventTimingStatus(event as any);
      setIsTimeReached(t.isPastStart);
      setCanJoinWindow(t.canJoinEarly);
    }, 10000); // 10s is sufficient for periodic check
    return () => clearInterval(interval);
  }, [event]);

  const role = normalizeRole(initialRole);

  const {
    callObject,
    isLive,
    isRecording,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isLoading,
    ready,
    error,
    toggleLive,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    endEvent,
  } = useDailySpeaker({ roomUrl, eventId, role, userName, token, enableJoin: hasJoined });

  useEffect(() => {
    if (isLive) {
      setHasBeenLive(true);
    }
    setBroadcastLive(isLive);
  }, [isLive, setBroadcastLive]);

  const { hours, minutes, seconds } = useCountdown(startTime || new Date());

  // Start camera/mic for lobby preview (Speakers only)
  useEffect(() => {
    if (!hasJoined && callObject && role === 'Speaker') { // Only auto-start for regular speakers in lobby
      // NOTE: logic moved to Lobby? Or handled by daily-react hooks in background? 
      // Originally this was explicit.
      if (callObject.participants().local && !isCamOn) {
        // callObject.startCamera(); 
        // useDailySpeaker handles media state via useDailyMediaControls.
      }
    }
  }, [hasJoined, callObject, role, isCamOn]);


  // 1. Session Expired (Past end time + 30m buffer)
  if (timing.isExpired) {
    return <SpeakerStatusDisplay status="expired" role={role} />;
  }

  // 2. Too Early (and not allowed)
  if (!canJoinWindow && !isTimeReached) {
    return <SpeakerStatusDisplay status="too-early" hours={hours} minutes={minutes} seconds={seconds} role={role} />;
  }

  // 3. Error
  if (error) {
    return <SpeakerStatusDisplay status="connection-error" error={error} role={role} />;
  }

  // 4. Lobby (Pre-Join)
  if (!hasJoined) {
    if (!callObject) return <SpeakerStatusDisplay status="loading" role={role} />;

    return (
      <DailyProvider callObject={callObject}>
        <SpeakerLobby
          role={role}
          isMicOn={isMicOn}
          isCamOn={isCamOn}
          isLive={isLive}
          startTime={startTime}
          onJoin={() => setHasJoined(true)}
          toggleMic={toggleMic}
          toggleCam={toggleCam}
        />
      </DailyProvider>
    );
  }

  // 5. Connecting
  if (!callObject || !ready) {
    return <SpeakerStatusDisplay status="loading" role={role} />;
  }

  // 6. Active Stage
  return (
    <DailyProvider callObject={callObject}>
      <DailyAudio />
      <SpeakerStage
        callObject={callObject}
        isLive={isLive}
        isRecording={isRecording}
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        isLoading={isLoading}
        toggleLive={toggleLive}
        toggleMic={toggleMic}
        toggleCam={toggleCam}
        toggleScreenShare={toggleScreenShare}
        role={role}
        eventId={eventId}
        startTime={startTime}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        hasBeenLive={hasBeenLive}
        endEvent={endEvent}
        isTimeReached={isTimeReached}
        userName={userName || undefined}
      />
    </DailyProvider>
  );
}
