'use client';

import React from 'react';
import { MediaControls } from '@/components/shared/MediaControls';
import { Button } from '@/components/ui/button';
import { Radio, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role, ROLES } from '@/app/auth/roles';

interface SpeakerControlsProps {
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreenShare: () => void;
  role: Role;
  isLive?: boolean;
  onToggleLive?: () => void;
  onEndEvent?: () => void;
  isLoading?: boolean;
}

export function SpeakerControls({
  isMicOn,
  isCamOn,
  isScreenSharing,
  onToggleMic,
  onToggleCam,
  onToggleScreenShare,
  role,
  isLive = false,
  onToggleLive,
  onEndEvent,
  isLoading = false,
}: SpeakerControlsProps) {
  return (
    <div className="w-full h-20 bg-background border-t flex items-center justify-center gap-6 px-4 z-50">
      {role === ROLES.MODERATOR && onToggleLive && (
        <div className="flex items-center gap-2">
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Radio className="mr-2 h-4 w-4" />
            )}
            {isLive ? 'Stop Airing' : 'Go On Air'}
          </Button>

          {isLive && onEndEvent && (
            <Button
              variant="outline"
              size="lg"
              onClick={onEndEvent}
              disabled={isLoading}
              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              End Event
            </Button>
          )}
        </div>
      )}

      {role === ROLES.MODERATOR && <div className="w-px h-8 bg-border" />}

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
