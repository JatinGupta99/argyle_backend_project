'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DailyProvider, useLocalParticipant } from '@daily-co/daily-react';
import { useEventRole } from '@/hooks/useEventRole';
import { ModeratorControls } from '@/components/moderator/ModeratorControls';
import { SpeakerVideoPreview } from '@/components/speaker/SpeakerVideoPreview';
import { Loader2, AlertCircle, Users, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/lib/types/components';
import { useEventContext } from '@/components/providers/EventContextProvider';

const FullScreenState = ({
  loading,
  message,
  errorMessage,
}: {
  loading?: boolean;
  message?: string;
  errorMessage?: string;
}) => (
  <div className="flex flex-col items-center justify-center h-screen bg-background gap-4 p-4">
    {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
    {loading && <p className="text-muted-foreground">{message}</p>}
    {errorMessage && (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )}
  </div>
);

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
  } = useEventRole(event, 'moderator');

  const localParticipant = useLocalParticipant();

  if (error) return <FullScreenState errorMessage={error} />;
  if (!callObject)
    return (
      <FullScreenState
        loading
        message="Initializing Moderator Control Panel..."
      />
    );

  return (
    <DailyProvider callObject={callObject}>
      <div className="flex flex-col h-screen bg-slate-950 text-white">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Moderator Control Panel
            </h1>
            <span className="text-slate-500">|</span>
            <span className="text-sm text-slate-400">
              Event ID: {event._id}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}
              />
              <span
                className={`text-sm font-medium ${isLive ? 'text-red-500' : 'text-slate-500'}`}
              >
                {isLive ? 'BROADCASTING' : 'STANDBY'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 flex gap-6 overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl aspect-video relative">
              <SpeakerVideoPreview
                localParticipant={localParticipant}
                isLive={isLive}
                isCamOn={isCamOn}
                role="moderator"
              />
            </div>

            <div className="mt-6 text-center max-w-lg">
              {!isLive ? (
                <div className="space-y-3 text-slate-400 text-sm">
                  <p>
                    You are in <strong>Standby Mode</strong>. Set up your camera
                    and microphone, then click{' '}
                    <strong className="text-green-400">Go Live</strong> when
                    ready to broadcast.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> Attendees waiting
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Event not started
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-red-400 font-semibold animate-pulse">
                    🔴 BROADCASTING LIVE
                  </p>
                  <p className="text-slate-400 text-xs">
                    All attendees can see and hear you. Click{' '}
                    <strong>Stop Live</strong> to end the broadcast.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-72 space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Event Status
                </h3>
                {[
                  [
                    'Broadcast State',
                    isLive ? 'Live' : 'Offline',
                    isLive ? 'text-red-400' : 'text-slate-400',
                  ],
                  [
                    'Microphone',
                    isMicOn ? 'On' : 'Off',
                    isMicOn ? 'text-green-400' : 'text-slate-400',
                  ],
                  [
                    'Camera',
                    isCamOn ? 'On' : 'Off',
                    isCamOn ? 'text-green-400' : 'text-slate-400',
                  ],
                  [
                    'Screen Share',
                    isScreenSharing ? 'Active' : 'Inactive',
                    isScreenSharing ? 'text-blue-400' : 'text-slate-400',
                  ],
                ].map(([label, value, color]) => (
                  <div
                    key={label as string}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className={`font-medium ${color}`}>{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Moderator Guide
                </h3>
                {[
                  'Test your audio and video before going live',
                  'Click "Go Live" to start broadcasting',
                  'Speakers can only control their own media',
                  'Only you can stop the broadcast',
                ].map((item) => (
                  <div key={item} className="flex gap-2 text-xs text-slate-400">
                    <span className="text-green-400">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </main>

        {/* Controls */}
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
        />
      </div>
    </DailyProvider>
  );
}

export default function ModeratorPage() {
  const event = useEventContext();

  if (!event)
    return <FullScreenState errorMessage="Could not find the event." />;

  return <ModeratorViewContent event={event} />;
}
