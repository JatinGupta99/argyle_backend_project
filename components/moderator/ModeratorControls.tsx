'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaControls } from '@/components/shared/MediaControls';

interface ModeratorControlsProps {
  isLive: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleLive: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  isLoading?: boolean;
}

export function ModeratorControls({
  isLive,
  isMicOn,
  isCamOn,
  isScreenSharing,
  onToggleLive,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
  isLoading = false,
}: ModeratorControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t flex items-center justify-center gap-6 px-4 z-50">
      {/* Go Live / Stop Live Button */}
      <Button
        variant={isLive ? 'destructive' : 'default'}
        size="lg"
        onClick={onToggleLive}
        disabled={isLoading}
        className={cn(
          'min-w-[140px] font-semibold transition-all',
          isLive ? 'animate-pulse' : 'bg-green-600 hover:bg-green-700'
        )}
      >
        {isLoading ? (
          'Processing...'
        ) : isLive ? (
          <>
            <Radio className="mr-2 h-4 w-4" /> Stop Live
          </>
        ) : (
          <>
            <Radio className="mr-2 h-4 w-4" /> Go Live
          </>
        )}
      </Button>

      <div className="w-px h-8 bg-border" />

      {/* Media Controls */}
      <MediaControls
        isMicOn={isMicOn}
        isCamOn={isCamOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
        onToggleScreenShare={onToggleScreenShare}
      />
    </div>
  );
}
