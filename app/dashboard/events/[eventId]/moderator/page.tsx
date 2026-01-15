'use client';

import { useState, useEffect } from 'react';
import { ModeratorControls } from '@/components/moderator/ModeratorControls';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { SpeakerVideoPreview } from '@/components/speaker/SpeakerVideoPreview';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { useEventRole } from '@/hooks/useEventRole';
import { Event } from '@/lib/types/components';
import { DailyProvider, useLocalParticipant } from '@daily-co/daily-react';
import { AlertCircle, Clock, Loader2, Users } from 'lucide-react';
import { PageGuard } from '@/components/auth/PageGuard';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-context';
import { extractRoleFromInviteToken, extractNameFromToken } from '@/lib/utils/jwt-utils';

/**
 * FullScreenState - Shared UI for loading/error states
 */
const FullScreenState = ({
  loading,
  message,
  errorMessage,
}: {
  loading?: boolean;
  message?: string;
  errorMessage?: string;
}) => (
  <div className="flex flex-col items-center justify-center h-full bg-background gap-4 p-4 text-center">
    {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
    {loading && <p className="text-muted-foreground font-medium">{message}</p>}
    {errorMessage && (
      <div className="flex flex-col items-center gap-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          Reload Page
        </button>
      </div>
    )}
  </div>
);

/**
 * ModeratorViewContent - Main rendering logic for the moderator panel
 */
function ModeratorViewContent({ event }: { event: Event }) {
  const {
    callObject,
    isLive,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isLoading,
    error,
    toggleLive,
    toggleMic,
    toggleCam,
    toggleScreenShare,
  } = useEventRole(event, ROLES_ADMIN.Moderator);

  const localParticipant = useLocalParticipant();

  const [isTimeReached, setIsTimeReached] = useState<boolean>(() => {
    const targetDate = event.schedule?.startTime ? new Date(event.schedule.startTime) : new Date();
    return new Date() >= targetDate;
  });

  useEffect(() => {
    if (isTimeReached) return;

    const targetDate = event.schedule?.startTime ? new Date(event.schedule.startTime) : new Date();
    const interval = setInterval(() => {
      if (new Date() >= targetDate) {
        setIsTimeReached(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event.schedule?.startTime, isTimeReached]);

  if (error) return <FullScreenState errorMessage={error} />;

  if (!callObject) {
    return (
      <FullScreenState
        loading
        message="Initializing Moderator Control Panel..."
      />
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Moderator Console
            </h1>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-500 font-mono tracking-wider">
              ID: {event._id}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isLive ? 'border-red-500/30 bg-red-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
              <div
                className={`h-2 w-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}
              />
              <span
                className={`text-[10px] font-bold tracking-widest ${isLive ? 'text-red-500' : 'text-slate-400'}`}
              >
                {isLive ? 'BROADCASTING' : 'STANDBY'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Active Preview Area */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0">
            <div className="w-full max-w-4xl aspect-video relative shadow-2xl rounded-xl overflow-hidden ring-1 ring-slate-800">
              <SpeakerVideoPreview
                localParticipant={localParticipant}
                isLive={isLive}
                isCamOn={isCamOn}
                isMicOn={isMicOn}
                role={ROLES_ADMIN.Moderator}
              />
            </div>

            <div className="mt-8 text-center max-w-lg">
              {!isLive ? (
                <div className="space-y-4 text-slate-400">
                  <p className="text-sm leading-relaxed">
                    You are currently in <span className="text-white font-semibold">Standby Mode</span>. <br />
                    Verify your stage presence below, then click{' '}
                    <span className="text-blue-400 font-bold">Go Live</span> to begin the stream.
                  </p>
                  <div className="flex items-center justify-center gap-8 py-3 px-6 bg-slate-900/50 rounded-xl border border-slate-800/50">
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="h-3 w-3 text-slate-500" />
                      <span>Attendees Waiting</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{event.status === 'LIVE' ? 'Stream Ready' : 'Pre-event'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 rounded-lg text-xs font-black text-white shadow-lg shadow-red-900/40">
                    <div className="w-1.5 h-1.5 bg-background rounded-full animate-ping" />
                    TRANSMITTING LIVE
                  </div>
                  <p className="text-slate-400 text-xs">
                    Your broadcast is visible to all attendees. <br />
                    Click <strong>Stop Live</strong> in the console below to end.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 flex flex-col gap-4 overflow-y-auto">
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
              <div className="h-1 bg-blue-500/50" />
              <CardContent className="p-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Hardware Status
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Broadcast Status', value: isLive ? 'Streaming' : 'Stationary', color: isLive ? 'text-red-400' : 'text-slate-500' },
                    { label: 'Microphone', value: isMicOn ? 'Active' : 'Muted', color: isMicOn ? 'text-emerald-400' : 'text-slate-500' },
                    { label: 'Camera', value: isCamOn ? 'Enabled' : 'Disabled', color: isCamOn ? 'text-emerald-400' : 'text-slate-500' },
                    { label: 'Screen Mirror', value: isScreenSharing ? 'Active' : 'Inactive', color: isScreenSharing ? 'text-blue-400' : 'text-slate-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center group">
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">{item.label}</span>
                      <span className={`text-[11px] font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800/80 shadow-md">
              <CardContent className="p-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Stream Protocol
                </h3>
                <div className="space-y-3">
                  {[
                    'Verify bandwidth before going live',
                    'Start broadcast 2m before scheduled time',
                    'Acknowledge chat questions in post-show',
                    'Ensure "Stop Live" is clicked when finished',
                  ].map((guide, idx) => (
                    <div key={idx} className="flex gap-3 text-[11px] leading-relaxed text-slate-400">
                      <span className="text-blue-500/50 font-mono">{idx + 1}.</span>
                      <span>{guide}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>

        {/* Console Controls */}
        <footer className="relative z-20">
          <ModeratorControls
            isLive={isLive}
            isMicOn={isMicOn}
            isCamOn={isCamOn}
            isScreenSharing={isScreenSharing}
            onToggleLive={toggleLive!}
            onToggleMic={toggleMic}
            onToggleCam={toggleCam}
            onToggleScreenShare={toggleScreenShare}
            isLoading={isLoading}
            isTimeReached={isTimeReached}
          />
        </footer>
      </div>
    </DailyProvider>
  );
}

/**
 * ModeratorPage Root Component
 * Enforces authentication and authorization guards at the route level.
 */
export default function ModeratorPage() {
  const event = useEventContext();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  const { setAuth, token: authToken } = useAuth();

  useEffect(() => {
    if (urlToken && urlToken !== authToken) {
      const role = extractRoleFromInviteToken(urlToken);
      const name = extractNameFromToken(urlToken) || ROLES_ADMIN.Moderator;
      setAuth(role, name, urlToken);
    }
  }, [urlToken, authToken, setAuth]);

  if (!event) {
    return <FullScreenState errorMessage="Critical Error: Event context could not be established." />;
  }

  return (
    <PageGuard permission="event:manage" role={ROLES_ADMIN.Moderator}>
      <ModeratorViewContent event={event as Event} />
    </PageGuard>
  );
}
