'use client';

import { normalizeRole } from '@/app/auth/access';
import { Role, ROLES } from '@/app/auth/roles';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/hooks/useCountdown';
import { useDailySpeaker } from '@/hooks/useDailySpeaker';
import { DailyAudio, DailyProvider, DailyVideo, useLocalParticipant, useParticipantIds, useParticipantProperty, useScreenShare } from '@daily-co/daily-react';
import { AlertCircle, Clock, Loader2, Mic, MicOff, Radio, Shield, Video, VideoOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ParticipantTile } from './ParticipantTile';
import { SpeakerControls } from './SpeakerControls';
import { SpeakerPreviewWrapper } from './SpeakerPreviewWrapper';

interface SpeakerViewContentProps {
  eventId: string;
  roomUrl: string;
  role?: Role;
  userName?: string;
  token?: string | null;
  initialIsLive?: boolean;
  startTime?: Date;
}

function SpeakerInterface({
  isLive,
  isRecording,
  isMicOn,
  isCamOn,
  isScreenSharing,
  isLoading,
  toggleLive,
  toggleMic,
  toggleCam,
  toggleScreenShare,
  role,
  eventId,
  callObject,
  startTime,
  hours,
  minutes,
  seconds,
  hasBeenLive,
  endEvent,
}: {
  isLive: boolean;
  isRecording: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  isLoading: boolean;
  toggleLive: () => void;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleScreenShare: () => void;
  role: Role;
  eventId: string;
  callObject: any;
  startTime?: Date;
  hours: number;
  minutes: number;
  seconds: number;
  hasBeenLive: boolean;
  endEvent: () => void;
}) {
  const localParticipant = useLocalParticipant();
  const participantIds = useParticipantIds();

  // 1. Separate Remote Speakers from the rest
  const remoteSpeakerIds = participantIds.filter(id => {
    const p = callObject.participants()?.[id];
    if (!p || p.local) return false; // Exclude local

    // Hide attendees and Moderators (owners)
    if (p.user_name?.startsWith('Attendee_') || p.owner) {
      return false;
    }
    return true;
  });

  // 2. Identify the local participant's role
  const isLocalSpeaker = !localParticipant?.owner && !localParticipant?.user_name?.startsWith('Attendee_');

  // 3. Decide who to show on the "Stage"
  // If remote speakers exist, show them AND the local participant (so they see 'two speakers' in a grid)
  // If no remote speakers exist, show only the local participant (Self-preview)
  let filteredParticipantIds: string[] = [];
  if (remoteSpeakerIds.length > 0) {
    filteredParticipantIds = isLocalSpeaker && localParticipant
      ? [localParticipant.session_id, ...remoteSpeakerIds]
      : remoteSpeakerIds;
  } else if (isLocalSpeaker && localParticipant) {
    filteredParticipantIds = [localParticipant.session_id];
  }

  const { screens } = useScreenShare();
  const hasScreenShare = screens.length > 0;
  // Focus on the most recent share
  const screenId = hasScreenShare ? screens[screens.length - 1].session_id : null;
  const screenUserName = useParticipantProperty(screenId || '', 'user_name');

  // Determine Layout Mode
  let layoutMode: 'single' | 'grid' | 'screen-share' = 'grid';
  if (hasScreenShare) {
    layoutMode = 'screen-share';
  } else if (filteredParticipantIds.length <= 1) {
    layoutMode = 'single';
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header / Status Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card h-16 flex-none">
        <div className="flex items-center gap-3">
          {isLive ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              ON AIR
            </span>
          ) : (
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border
              ${hasBeenLive
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
              <Clock className="w-4 h-4" />
              {hasBeenLive ? 'ON BREAK' : 'OFF AIR'}
              {startTime && !hasBeenLive && (
                <span className="font-mono text-xs ml-1">
                  {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
              )}
            </span>
          )}

          {isRecording && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-red-600/20 text-red-500 border border-red-500/40 animate-pulse">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              REC
            </span>
          )}
        </div>
        {!isLive && (
          <p className="text-xs text-muted-foreground">Attendees cannot see you yet</p>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">


        {/* MODE: SCREEN SHARE */}
        {layoutMode === 'screen-share' && screenId && (
          <div className="flex h-full p-4 gap-4">
            {/* Main Stage: Screen Share */}
            <div className="flex-1 bg-black rounded-lg overflow-hidden relative shadow-xl border border-slate-800">
              <DailyVideo
                type="screenVideo"
                sessionId={screenId!}
                className="w-full h-full object-contain"
                fit="contain"
              />
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {screenUserName ? `${screenUserName} is presenting` : 'Someone is presenting'}
              </div>
            </div>

            {/* Sidebar: Participants */}
            <div className="w-64 flex-none flex flex-col gap-3 overflow-y-auto pr-2">
              {filteredParticipantIds.map((id: string) => (
                <ParticipantTile
                  key={id}
                  sessionId={id}
                  isLocal={localParticipant?.session_id === id}
                  className="aspect-video w-full flex-none"
                />
              ))}
            </div>
          </div>
        )}

        {/* MODE: SINGLE FULL SCREEN */}
        {layoutMode === 'single' && filteredParticipantIds.length > 0 && (
          <div className="w-full h-full p-4">
            <ParticipantTile
              sessionId={filteredParticipantIds[0]}
              isLocal={localParticipant?.session_id === filteredParticipantIds[0]}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Fallback for Speaker Self-Preview (Only if they are a speaker and alone) */}
        {layoutMode === 'single' && filteredParticipantIds.length === 0 && isLocalSpeaker && (
          <div className="w-full h-full p-4">
            <ParticipantTile
              sessionId={localParticipant?.session_id || ''}
              isLocal={true}
              className="w-full h-full"
            />
          </div>
        )}

        {/* STAGE PLACEHOLDER: No speakers (Only for Moderators) */}
        {layoutMode === 'single' && filteredParticipantIds.length === 0 && !isLocalSpeaker && (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
              <Radio className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Stage Empty</h3>
            <p className="text-slate-400 max-w-sm">
              The event is {isLive ? 'running' : 'waiting to start'}, but no speakers or attendee are currently on stage.
            </p>
          </div>
        )}

        {/* MODE: GRID VIEW */}
        {layoutMode === 'grid' && filteredParticipantIds.length > 0 && (
          <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
            <div className={`grid gap-4 max-w-7xl mx-auto w-full transition-all duration-300
                    ${/* 2 People: Side by side */ ''}
                    ${filteredParticipantIds.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl' : ''}
                    
                    ${/* 3 People: 3 side by side on desktop, pyramid on mobile */ ''}
                    ${filteredParticipantIds.length === 3 ? 'grid-cols-1 md:grid-cols-3' : ''}

                    ${/* 4 People: 2x2 Grid */ ''}
                    ${filteredParticipantIds.length === 4 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' : ''}

                    ${/* 5-6 People: 3 columns */ ''}
                    ${filteredParticipantIds.length >= 5 && filteredParticipantIds.length <= 6 ? 'grid-cols-2 md:grid-cols-3' : ''}

                    ${/* 7+ People: 4 columns */ ''}
                    ${filteredParticipantIds.length >= 7 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''}
                `}>
              {filteredParticipantIds.map((id: string) => (
                <ParticipantTile
                  key={id}
                  sessionId={id}
                  isLocal={localParticipant?.session_id === id}
                  className="aspect-video"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <SpeakerControls
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreenShare={toggleScreenShare}
        role={role}
        isLive={isLive}
        onToggleLive={toggleLive}
        onEndEvent={role === ROLES.MODERATOR ? endEvent : undefined}
        isLoading={isLoading}
      />
    </div>
  );
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
  }, [isLive]);

  const { hours, minutes, seconds } = useCountdown(startTime || new Date());

  // Start camera/mic for lobby preview (Speakers only)
  useEffect(() => {
    if (!hasJoined && callObject && role !== ROLES.MODERATOR) {
      console.log('[SpeakerViewContent] Starting camera for lobby preview...');
      callObject.startCamera();
    }
  }, [hasJoined, callObject, role]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connection Error</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {error}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  if (!hasJoined) {
    if (!callObject) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
      <DailyProvider callObject={callObject}>
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
          {/* 1. Background Layer */}
          <div className="absolute inset-0 z-0">
            {role === ROLES.MODERATOR ? (
              // Moderator: Clean Professional Gradient
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
              </div>
            ) : (
              // Speaker: Immersive Video Preview
              <>
                <SpeakerPreviewWrapper role={role} isCamOn={isCamOn} isMicOn={isMicOn} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
              </>
            )}
          </div>

          {/* 2. Top-Left Role Indicator */}
          <div className="absolute top-8 left-8 z-20">
            <div className="flex flex-col gap-1">
              <span className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase backdrop-blur-xl border shadow-2xl
                ${role === ROLES.MODERATOR
                  ? 'bg-blue-500/10 text-blue-300 border-blue-400/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'}`}>
                {role === ROLES.MODERATOR ? <Shield className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                {role === ROLES.MODERATOR ? 'Moderator' : 'Speaker'}
              </span>
            </div>
          </div>

          {/* 3. Role-Based Content Layout */}
          {role === ROLES.MODERATOR ? (
            // MODERATOR JOIN: Centered Card
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col gap-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-400/20">
                    <Shield className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Stage Control</h2>
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span className={`text-xs font-bold uppercase tracking-widest ${isLive ? 'text-red-400' : 'text-slate-400'}`}>
                        {isLive ? 'ON AIR' : 'OFF AIR'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    size="lg"
                    className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg transition-all"
                    onClick={() => setHasJoined(true)}
                  >
                    Enter Control Room
                  </Button>
                  <p className="text-[10px] text-center text-slate-500 mt-6 font-medium uppercase tracking-widest leading-relaxed">
                    You can manage speakers and broadcast state from the stage.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // SPEAKER JOIN: Footer-Pinned Controls (To not block face)
            <div className="absolute inset-x-0 bottom-0 z-10 p-12 flex flex-col items-center">
              <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex items-center justify-between gap-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Left: Status */}
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                    <span className={`text-sm font-black uppercase tracking-widest ${isLive ? 'text-red-500' : 'text-slate-400'}`}>
                      {isLive ? 'ON AIR' : 'OFF AIR'}
                    </span>
                  </div>
                  {!isLive && startTime && (
                    <></>
                  )}
                </div>

                {/* Center: Device Controls */}
                <div className="flex items-center gap-6 px-8 border-x border-white/5">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant={isMicOn ? "outline" : "destructive"}
                      size="icon"
                      onClick={toggleMic}
                      className={`w-12 h-12 rounded-xl transition-all ${isMicOn ? 'bg-white/10 border-white/10' : ''}`}
                    >
                      {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                    </Button>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isMicOn ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                      Mic {isMicOn ? 'On' : 'Off'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant={isCamOn ? "outline" : "destructive"}
                      size="icon"
                      onClick={toggleCam}
                      className={`w-12 h-12 rounded-xl transition-all ${isCamOn ? 'bg-white/10 border-white/10' : ''}`}
                    >
                      {isCamOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                    </Button>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isCamOn ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                      Cam {isCamOn ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex-1 max-w-[280px]">
                  <Button
                    size="lg"
                    className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setHasJoined(true)}
                  >
                    Enter Stage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DailyProvider>
    )
  }

  console.log('[useDailyBase] callObject:', callObject);
  console.log('[useDailyBase] ready:', ready);
  console.log('[useDailyBase] error:', error);
  console.log('[useDailyBase] isLoading:', isLoading);
  console.log('[useDailyBase] isLive:', isLive);
  console.log('[useDailyBase] isMicOn:', isMicOn);
  console.log('[useDailyBase] isCamOn:', isCamOn);
  console.log('[useDailyBase] isScreenSharing:', isScreenSharing);
  if (!callObject || !ready) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg font-medium animate-pulse">Joining meeting...</p>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <DailyAudio />
      <SpeakerInterface
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
        callObject={callObject}
        startTime={startTime}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        hasBeenLive={hasBeenLive}
        endEvent={endEvent}
      />
    </DailyProvider>
  );
}
