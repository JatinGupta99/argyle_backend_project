import React, { useState, useEffect, useMemo } from 'react';
import { DailyAudio, DailyProvider } from '@daily-co/daily-react';
import { useDailyBase } from '@/hooks/useDailyBase';
import { Role } from '@/app/auth/roles';
import { useAuth } from '@/app/auth/auth-context';
import { useCountdown } from '@/hooks/useCountdown';
import { VideoGrid } from './VideoGrid';
import { fetchMeetingToken } from '@/lib/api/daily';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';
import { Loader2, Clock, AlertCircle, RefreshCw, CheckCircle2, CalendarX } from 'lucide-react';
import { RoomStateDisplay } from './RoomStateDisplay';

export interface DailyRoomProps {
  role: Role;
  startTime: Date;
  roomUrl: string;
  eventIsLive: boolean; // This is the time-based live status
  eventId: string;
}

export function DailyRoomAttendee({ role, startTime, roomUrl: initialRoomUrl, eventIsLive, eventId }: DailyRoomProps) {
  const { token: authToken } = useAuth();

  const [tokenParams, setTokenParams] = useState<{ token: string | null, dailyToken: string | null, dailyUrl: string | null }>(() => {
    if (typeof window === 'undefined') return { token: null, dailyToken: null, dailyUrl: null };
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token') || authToken;

    if (urlToken) {
      const details = extractUserDataFromToken(urlToken);
      return {
        token: urlToken,
        dailyToken: details?.dailyToken || null,
        dailyUrl: details?.dailyUrl || null
      };
    }
    return { token: null, dailyToken: null, dailyUrl: null };
  });

  const token = tokenParams.token;
  const roomUrl = tokenParams.dailyUrl; // Strictly use token-provided URL, no fallback
  const joinToken = tokenParams.dailyToken || token; // Prefer internal daily_token if available

  const userData = useMemo(() => {
    if (!token) return null;
    return extractUserDataFromToken(token);
  }, [token]);

  const userName = userData?.name || `Attendee_${Math.floor(Math.random() * 1000)}`;

  // Keep token in sync if authToken loads late (hydration)
  useEffect(() => {
    if (!tokenParams.token && authToken) {
      const details = extractUserDataFromToken(authToken);
      setTokenParams({
        token: authToken,
        dailyToken: details?.dailyToken || null,
        dailyUrl: details?.dailyUrl || null
      });
    }
  }, [authToken, tokenParams.token]);

  useEffect(() => {
    if (token) return;

    if (eventIsLive && eventId) {
      fetchMeetingToken(eventId).then(newToken => {
        // Fallback fetch for raw daily token if no JWT token exists
        setTokenParams({
          token: newToken,
          dailyToken: null,
          dailyUrl: null // Note: API should ideally return roomUrl too if we strictly require it
        });
      });
    }
  }, [eventIsLive, eventId, token]);

  // Joined automatically in background once time is reached
  const { callObject, ready, error } = useDailyBase(
    roomUrl || '',
    eventIsLive && !!roomUrl,
    userName,
    joinToken,
    userData
  );

  if (!roomUrl && token) {
    return (
      <RoomStateDisplay
        variant="default"
        icon={AlertCircle}
        title="Invalid Invite"
        description="This invite token does not contain a valid room link. Please contact the organizer."
      />
    );
  }

  if (error) {
    const errorMsg = typeof error === 'string' ? error.toLowerCase() : '';
    const isRoomUnavailable = errorMsg.includes('no longer available') ||
      errorMsg.includes('meeting has ended') ||
      errorMsg.includes('room not found') ||
      errorMsg.includes('room_deleted');

    if (isRoomUnavailable) {
      return (
        <RoomStateDisplay
          variant="default"
          icon={CalendarX}
          title="Event Unavailable"
          description="The live room is currently closed. The event may have concluded or is not scheduled for this time."
          action={
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl text-sm font-bold transition-all border border-secondary/20"
            >
              <RefreshCw size={16} /> Check Status Again
            </button>
          }
        />
      );
    }

    return (
      <RoomStateDisplay
        variant="default"
        icon={AlertCircle}
        title="Connection Issue"
        description={typeof error === 'string' ? `${error}. Please try reloading.` : "We're having trouble connecting to the broadcast. Please try reloading."}
        action={
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold transition-all shadow-lg"
          >
            <RefreshCw size={16} /> Reload Page
          </button>
        }
      />
    );
  }

  if (!eventIsLive) {
    return <CountdownView startTime={startTime} />;
  }

  if (!callObject || !ready) {
    return (
      <RoomStateDisplay
        isLoading
        title="Connecting to Event"
        description="We are securing your connection to the live room..."
      />
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <AttendeeLobbyWrapper callObject={callObject} />
    </DailyProvider>
  );
}

function CountdownView({ startTime }: { startTime: Date }) {
  const { hours, minutes, seconds } = useCountdown(startTime);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-2">
      <p className="text-lg">Event starts in</p>
      <p className="font-bold text-green-400 animate-pulse font-mono text-2xl">
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
}

function AttendeeLobbyWrapper({ callObject }: { callObject: any }) {
  const [hasJoinedStage, setHasJoinedStage] = useState(false);
  const [isModeratorLive, setIsModeratorLive] = useState(false);
  const [hasBeenLive, setHasBeenLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!callObject) return;

    const checkLiveStatus = () => {
      const participants = callObject.participants();
      const live = Object.values(participants).some((p: any) =>
        p.owner && p.userData?.isLive === true
      );

      const ended = Object.values(participants).some((p: any) =>
        p.owner && p.userData?.isEnded === true
      );

      setIsModeratorLive(live);
      setIsEnded(ended);
      if (live) {
        setHasBeenLive(true);
      }
    };

    // Initial check
    checkLiveStatus();

    // Listen for participant updates
    callObject.on('participant-joined', checkLiveStatus);
    callObject.on('participant-updated', checkLiveStatus);
    callObject.on('participant-left', checkLiveStatus);

    return () => {
      callObject.off('participant-joined', checkLiveStatus);
      callObject.off('participant-updated', checkLiveStatus);
      callObject.off('participant-left', checkLiveStatus);
    };
  }, [callObject]);

  if (isEnded) {
    return (
      <RoomStateDisplay
        variant="default"
        icon={CheckCircle2}
        title="Event Concluded"
        description="Thank you for attending! The broadcast has officially ended. We hope you enjoyed the session."
        action={
          <button
            onClick={() => window.close()}
            className="px-8 py-3 bg-slate-800 border border-white/10 rounded-xl font-bold hover:bg-slate-700 transition-all text-slate-200"
          >
            Close Window
          </button>
        }
      />
    );
  }

  if (hasJoinedStage && isModeratorLive) {
    return (
      <>
        <DailyAudio autoSubscribeActiveSpeaker maxSpeakers={12} />
        <VideoGrid callObject={callObject} />
      </>
    );
  }

  // If was previously live but now stopped -> SHOW BREAK SCREEN
  if (hasBeenLive && !isModeratorLive) {
    return (
      <RoomStateDisplay
        variant="warning"
        icon={Clock}
        title="Short Break"
        description="The event is currently on a brief intermission. Please stay tuned, we will be back shortly!"
        action={
          <div className="flex items-center gap-3 px-6 py-3 bg-amber-950/30 rounded-2xl border border-amber-500/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">Live Updates Paused</span>
          </div>
        }
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-6 p-8 text-center">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-2">
        <div className={`w-4 h-4 rounded-full ${isModeratorLive ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {isModeratorLive ? 'The Show is Live!' : 'Waiting for Moderator'}
        </h2>
        <p className="text-slate-400 max-w-sm">
          {isModeratorLive
            ? 'Moderators have started the stream. Click below to enter the stage.'
            : 'The room is ready. Please wait here until the moderator starts the broadcast.'}
        </p>
      </div>

      <button
        disabled={!isModeratorLive}
        onClick={() => setHasJoinedStage(true)}
        className={`px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl 
          ${isModeratorLive
            ? 'bg-primary hover:bg-primary/90 text-white transform hover:scale-105 active:scale-95'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
      >
        {isModeratorLive ? 'Join Event' : 'Waiting for Signal...'}
      </button>

      {!isModeratorLive && (
        <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking broadcast status...
        </div>
      )}
    </div>
  );
}
