'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, MonitorUp } from 'lucide-react';

interface MediaControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
}

export function MediaControls({
  isMicOn,
  isCamOn,
  isScreenSharing,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
}: MediaControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isMicOn ? 'outline' : 'destructive'}
        size="icon"
        onClick={onToggleMic}
        className="rounded-full h-12 w-12"
        title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        aria-label={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
      >
        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>

      <Button
        variant={isCamOn ? 'outline' : 'destructive'}
        size="icon"
        onClick={onToggleCam}
        className="rounded-full h-12 w-12"
        title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
        aria-label={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
      >
        {isCamOn ? (
          <Video className="h-5 w-5" />
        ) : (
          <VideoOff className="h-5 w-5" />
        )}
      </Button>

      <Button
        variant={isScreenSharing ? 'secondary' : 'outline'}
        size="icon"
        onClick={onToggleScreenShare}
        className={`rounded-full h-12 w-12 ${
          isScreenSharing &&
          'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200'
        }`}
        title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
        aria-label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        <MonitorUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
