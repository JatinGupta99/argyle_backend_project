import React, { useState, useEffect } from 'react';
import { DailyAudio, DailyProvider, useParticipantIds, useParticipantProperty, useLocalParticipant } from '@daily-co/daily-react';
import { useDailyBase } from '@/hooks/useDailyBase';
import { Role } from '@/app/auth/roles';
import { useCountdown } from '@/hooks/useCountdown';
import { VideoGrid } from './VideoGrid';
import { fetchMeetingToken } from '@/lib/api/daily';
import { Loader2, Clock } from 'lucide-react';

export interface DailyRoomProps {
  role: Role;
  startTime: Date;
  roomUrl: string;
  eventIsLive: boolean; // This is the time-based live status
  eventId: string;
}

export function DailyRoomAttendee({ role, startTime, roomUrl, eventIsLive, eventId }: DailyRoomProps) {
  const [userName] = useState(() => `Attendee_${Math.floor(Math.random() * 1000)}`);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    // Hardcoded for testing fallback as requested
    const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyIjoiYXNja2xubGFzY2siLCJ1ZCI6ImphdGluZ3VwdGFAZXhhbXBsZS5jb20iLCJ1IjoiVGVzdCBBdHRlbmRlZSIsImV4cCI6MTc2Nzk2MDE0NywibyI6ZmFsc2UsInNzIjpmYWxzZSwiZXB1aSI6dHJ1ZSwidm8iOnRydWUsImFvIjp0cnVlLCJwIjp7ImhwIjp0cnVlLCJjcyI6ZmFsc2UsImNhIjpmYWxzZX0sImQiOiIxM2ZkYjg5Yi1mMTM3LTQ3ZWYtYTczNS04M2EzOGM5ZTY2YTEiLCJpYXQiOjE3Njc4NzM3NDZ9.Fm-VG49Wdbom3bxi0d7U1JvlhkwaiocgYzdYN2gFnkw';

    return urlToken || hardcodedToken;
  });

  useEffect(() => {
    // Priority: URL Token > Hardcoded Token > Dynamic Fetch
    if (token) return;

    if (eventIsLive && eventId) {
      fetchMeetingToken(eventId).then(setToken);
    }
  }, [eventIsLive, eventId, token]);

  // Joined automatically in background once time is reached
  const { callObject, ready, error } = useDailyBase(
    roomUrl,
    eventIsLive,
    userName,
    token
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-4 p-6 text-center">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-xl font-bold text-red-500">Connection Failed</h3>
        <p className="text-gray-300 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!eventIsLive) {
    return <CountdownView startTime={startTime} />;
  }

  if (!callObject || !ready) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg">Preparing event room...</p>
      </div>
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
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-950 text-white gap-8 p-12 text-center animate-in zoom-in duration-700">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2 border border-primary/20">
          <div className="w-12 h-12 text-primary font-black text-4xl">✓</div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight uppercase">Event Concluded</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="text-slate-400 max-w-sm text-lg font-medium leading-relaxed">
            Thank you for attending! The broadcast has officially ended. We hope you enjoyed the session.
          </p>
        </div>

        <button
          onClick={() => window.close()}
          className="px-8 py-3 bg-slate-900 border border-white/10 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Close Window
        </button>
      </div>
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
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-950 text-white gap-8 p-12 text-center animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-2 border border-amber-500/20">
            <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping" />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight uppercase">Short Break</h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-400 max-w-sm text-lg font-medium leading-relaxed">
            The event is currently on a brief intermission. Please stay tuned, we will be back shortly!
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 rounded-2xl border border-white/5 shadow-2xl">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">Intermission</span>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
            Waiting for speakers to resume...
          </p>
        </div>
      </div>
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
