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
  isTimeReached?: boolean;
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
  isTimeReached = true,
}: SpeakerControlsProps) {
  const isGoLiveDisabled = isLoading || (!isLive && !isTimeReached);

  return (
    <div className="w-full h-20 bg-[#000a28] border-t border-white/10 flex items-center justify-center gap-6 px-4 z-50">
      {role === ROLES.MODERATOR && onToggleLive && (
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? 'destructive' : 'default'}
            size="lg"
            onClick={onToggleLive}
            disabled={isGoLiveDisabled}
            className={cn(
              'min-w-[140px] font-semibold transition-all',
              isLive ? 'animate-pulse' : 'bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-500'
            )}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Radio className="mr-2 h-4 w-4" />
            )}
            {isLive ? 'Stop Live' : 'Go Live'}
          </Button>

        </div>
      )}

      {role === ROLES.MODERATOR && <div className="w-px h-8 bg-white/10" />}

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
