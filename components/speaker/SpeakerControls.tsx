'use client';

import React from 'react';
import { MediaControls } from '@/components/shared/MediaControls';

import { Role } from '@/app/auth/roles';

interface SpeakerControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  role: Role;
}

export function SpeakerControls({
  isMicOn,
  isCamOn,
  isScreenSharing,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
  role,
}: SpeakerControlsProps) {
  return (
    <div className="w-full h-20 bg-background border-t flex items-center justify-center gap-4 px-4 z-50">
      <MediaControls
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
        onToggleScreenShare={onToggleScreenShare}
        role={role}
      />
    </div>
  );
}
