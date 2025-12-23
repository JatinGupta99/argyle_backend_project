'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, MonitorUp } from 'lucide-react';
import { canSendMedia, normalizeRole } from '@/app/auth/access';

interface MediaControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  role?: string;
}

export function MediaControls({
  isMicOn,
  isCamOn,
  isScreenSharing,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
  role,
}: MediaControlsProps) {
  // Determine permission allowlists. If no role provided we assume allowed (caller controls visibility).
  const audioAllowed = role ? canSendMedia(normalizeRole(role), 'audio') : true;
  const videoAllowed = role ? canSendMedia(normalizeRole(role), 'video') : true;
  const screenAllowed = role ? canSendMedia(normalizeRole(role), 'screenVideo') : true;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isMicOn ? 'outline' : 'destructive'}
        size="icon"
        onClick={onToggleMic}
        className="rounded-full h-12 w-12"
        title={audioAllowed ? (isMicOn ? 'Mute Microphone' : 'Unmute Microphone') : 'Audio not allowed for your role'}
        aria-label={audioAllowed ? (isMicOn ? 'Mute Microphone' : 'Unmute Microphone') : 'Audio not allowed for your role'}
        disabled={!audioAllowed}
      >
        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>

      <Button
        variant={isCamOn ? 'outline' : 'destructive'}
        size="icon"
        onClick={onToggleCam}
        className="rounded-full h-12 w-12"
        title={videoAllowed ? (isCamOn ? 'Turn Off Camera' : 'Turn On Camera') : 'Camera not allowed for your role'}
        aria-label={videoAllowed ? (isCamOn ? 'Turn Off Camera' : 'Turn On Camera') : 'Camera not allowed for your role'}
        disabled={!videoAllowed}
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
        title={screenAllowed ? (isScreenSharing ? 'Stop Sharing' : 'Share Screen') : 'Screen share not allowed for your role'}
        aria-label={screenAllowed ? (isScreenSharing ? 'Stop Sharing' : 'Share Screen') : 'Screen share not allowed for your role'}
        disabled={!screenAllowed}
      >
        <MonitorUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
