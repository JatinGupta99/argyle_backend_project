'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useDailySpeaker } from '@/hooks/useDailySpeaker';
import { useState, useEffect } from 'react';
import { DailyProvider, useLocalParticipant, useParticipantIds, DailyVideo, useScreenShare, DailyAudio } from '@daily-co/daily-react';
import { Loader2, Radio, AlertCircle, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { SpeakerControls } from './SpeakerControls';
import { SpeakerVideoPreview } from './SpeakerVideoPreview';
import { SpeakerPreviewWrapper } from './SpeakerPreviewWrapper';
import { ParticipantTile } from './ParticipantTile';
import { Role, ROLES } from '@/app/auth/roles';
import { normalizeRole } from '@/app/auth/access';

interface SpeakerViewContentProps {
  eventId: string;
  roomUrl: string;
  role?: Role;
  userName?: string;
  token?: string | null;
  initialIsLive?: boolean;
}

function SpeakerInterface({
  isLive,
  isMicOn,
  isCamOn,
  isScreenSharing,
  isLoading,
  toggleLive,
  toggleMic,
  toggleCam,
  toggleScreenShare,
  role,
}: {
  isLive: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  isLoading: boolean;
  toggleLive: () => void;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleScreenShare: () => void;
  role: Role;
}) {
  const localParticipant = useLocalParticipant();
  const participantIds = useParticipantIds();

  const { screens } = useScreenShare();
  const hasScreenShare = screens.length > 0;
  const screenId = hasScreenShare ? screens[0].session_id : null;

  // Determine Layout Mode
  let layoutMode: 'single' | 'grid' | 'screen-share' = 'grid';
  if (hasScreenShare) {
    layoutMode = 'screen-share';
  } else if (participantIds?.length === 1) {
    layoutMode = 'single';
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header / Status Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card h-16 flex-none">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}
          />
        </div>

        {role === ROLES.MODERATOR && (
          <Button
            onClick={toggleLive}
            disabled={isLoading}
            variant={isLive ? 'destructive' : 'default'}
            className="w-40"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Radio className="w-4 h-4 mr-2" />
            )}
            {isLive ? 'End Stream' : 'Go Live'}
          </Button>
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
                Screen Share
              </div>
            </div>

            {/* Sidebar: Participants */}
            <div className="w-64 flex-none flex flex-col gap-3 overflow-y-auto pr-2">
              {participantIds?.map(id => (
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
        {layoutMode === 'single' && (
          <div className="w-full h-full p-4">
            <ParticipantTile
              sessionId={participantIds?.[0] || localParticipant?.session_id || ''}
              isLocal={localParticipant?.session_id === participantIds?.[0]}
              className="w-full h-full"
            />
          </div>
        )}

        {/* MODE: GRID VIEW */}
        {layoutMode === 'grid' && (
          <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
            <div className={`grid gap-4 max-w-7xl mx-auto w-full transition-all duration-300
                    ${/* 2 People: Side by side */ ''}
                    ${participantIds?.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl' : ''}
                    
                    ${/* 3 People: 3 side by side on desktop, pyramid on mobile */ ''}
                    ${participantIds?.length === 3 ? 'grid-cols-1 md:grid-cols-3' : ''}

                    ${/* 4 People: 2x2 Grid */ ''}
                    ${participantIds?.length === 4 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' : ''}

                    ${/* 5-6 People: 3 columns */ ''}
                    ${participantIds?.length && participantIds.length >= 5 && participantIds.length <= 6 ? 'grid-cols-2 md:grid-cols-3' : ''}

                    ${/* 7+ People: 4 columns */ ''}
                    ${participantIds?.length && participantIds.length >= 7 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''}
                `}>
              {participantIds?.map(id => (
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
}: SpeakerViewContentProps) {
  const [hasJoined, setHasJoined] = useState(false);
  const role = normalizeRole(initialRole);

  const {
    callObject,
    isLive,
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
  } = useDailySpeaker({ roomUrl, eventId, role, userName, token, enableJoin: hasJoined });

  // Start camera/mic for lobby preview
  useEffect(() => {
    if (!hasJoined && callObject) {
      console.log('[SpeakerViewContent] Starting camera for lobby...');
      callObject.startCamera();
    }
  }, [hasJoined, callObject]);

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

  // LOBBY VIEW
  if (!hasJoined) {
    if (!callObject) return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    return (
      <DailyProvider callObject={callObject}>
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 items-center justify-center gap-8 p-6">
          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Ready to join?</h2>

            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6 relative">
              {/* Re-using SpeakerVideoPreview for consistency, assuming context provides local participant pre-join */}
              <SpeakerPreviewWrapper role={role} isCamOn={isCamOn} />
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <Button variant={isMicOn ? "outline" : "destructive"} size="icon" onClick={toggleMic} className="rounded-full w-14 h-14">
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>
              <Button variant={isCamOn ? "outline" : "destructive"} size="icon" onClick={toggleCam} className="rounded-full w-14 h-14">
                {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="w-full max-w-sm text-lg font-semibold bg-primary hover:bg-primary/90 h-12"
                onClick={() => setHasJoined(true)}
              >
                Join Event
              </Button>
            </div>
          </div>
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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-slate-900 text-white gap-4">
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
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        isLoading={isLoading}
        toggleLive={toggleLive}
        toggleMic={toggleMic}
        toggleCam={toggleCam}
        toggleScreenShare={toggleScreenShare}
        role={role}
      />
    </DailyProvider>
  );
}
