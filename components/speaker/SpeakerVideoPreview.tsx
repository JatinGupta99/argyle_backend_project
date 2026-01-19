'use client';

import React from 'react';
import { DailyVideo } from '@daily-co/daily-react';
import { DailyParticipant } from '@daily-co/daily-js';
import { User, Camera, CameraOff } from 'lucide-react';
import { Role, ROLES_ADMIN } from '@/app/auth/roles';

interface SpeakerVideoPreviewProps {
  localParticipant: DailyParticipant | null;
  isLive: boolean;
  isCamOn: boolean;
  isMicOn?: boolean;
  role?: Role;
}

export function SpeakerVideoPreview({
  localParticipant,
  isLive,
  isCamOn,
  isMicOn = false,
  role = ROLES_ADMIN.Speaker,
}: SpeakerVideoPreviewProps) {
  if (!localParticipant) return null;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
      {isCamOn ? (
        <DailyVideo
          type="video"
          sessionId={localParticipant.session_id}
          mirror
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-6 text-slate-400">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-600/30 shadow-2xl">
            <User className="w-16 h-16 text-slate-500" />
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <CameraOff className="w-5 h-5" />
            <p className="text-lg font-medium">Camera is off</p>
          </div>
        </div>
      )}

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

