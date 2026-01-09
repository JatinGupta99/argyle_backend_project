'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, MonitorUp } from 'lucide-react';
import { Role } from '@/app/auth/roles';
import { canSendMedia } from '@/app/auth/access';

interface MediaControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  role?: Role;
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
  const audioAllowed = role ? canSendMedia(role, 'audio') : true;
  const videoAllowed = role ? canSendMedia(role, 'video') : true;
  const screenAllowed = role ? canSendMedia(role, 'screenVideo') : true;

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

      {videoAllowed && (
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
      )}

      <Button
        variant={isScreenSharing ? 'secondary' : 'outline'}
        size="icon"
        onClick={onToggleScreenShare}
        className={`rounded-full h-12 w-12 ${isScreenSharing &&
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
