'use client';

import React from 'react';
import { DailyVideo } from '@daily-co/daily-react';
import { DailyParticipant } from '@daily-co/daily-js';
import { User } from 'lucide-react';

import { Role, ROLES } from '@/app/auth/roles';

interface SpeakerVideoPreviewProps {
  localParticipant: DailyParticipant | null;
  isLive: boolean;
  isCamOn: boolean;
  role?: Role;
}

export function SpeakerVideoPreview({
  localParticipant,
  isLive,
  isCamOn,
  role = ROLES.SPEAKER,
}: SpeakerVideoPreviewProps) {
  if (!localParticipant) return null;

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden shadow-xl border border-slate-800 flex items-center justify-center">
      {isCamOn ? (
        <DailyVideo
          type="video"
          sessionId={localParticipant.session_id}
          mirror
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <p className="text-lg font-medium">Camera is off</p>
        </div>
      )}

      {isLive && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          LIVE
        </div>
      )}

      {!isLive && (
        <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-sm font-bold">
          {role === ROLES.MODERATOR ? 'MODERATOR PREVIEW' : 'SPEAKER PREVIEW'}
        </div>
      )}
    </div>
  );
}
