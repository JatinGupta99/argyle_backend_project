'use client';

import React from 'react';
import { MediaControls } from '@/components/shared/MediaControls';

interface SpeakerControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
}

export function SpeakerControls({
  isMicOn,
  isCamOn,
  isScreenSharing,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
}: SpeakerControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t flex items-center justify-center gap-4 px-4 z-50">
      <MediaControls
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
        onToggleScreenShare={onToggleScreenShare}
        role="speaker"
      />
    </div>
  );
}
