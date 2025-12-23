'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useDailySpeaker } from '@/hooks/useDailySpeaker';
import { DailyProvider, useLocalParticipant } from '@daily-co/daily-react';
import { Loader2, Radio, AlertCircle } from 'lucide-react';
import { SpeakerControls } from './SpeakerControls';
import { SpeakerVideoPreview } from './SpeakerVideoPreview';

interface SpeakerViewContentProps {
  eventId: string;
  roomUrl: string;
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
}) {
  const localParticipant = useLocalParticipant();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Header / Status Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}
          />
          <span className="font-semibold text-lg">
            {isLive ? 'ON AIR' : 'OFF AIR'}
          </span>
        </div>

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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-4xl aspect-video">
          <SpeakerVideoPreview
            localParticipant={localParticipant}
            isLive={isLive}
            isCamOn={isCamOn}
            role="speaker"
          />
        </div>
      </div>

      {/* Controls */}
      <SpeakerControls
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreenShare={toggleScreenShare}
      />
    </div>
  );
}

export function SpeakerViewContent({
  eventId,
  roomUrl,
}: SpeakerViewContentProps) {
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
  } = useDailySpeaker({ roomUrl, eventId });

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

  if (!callObject) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
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
      />
    </DailyProvider>
  );
}
