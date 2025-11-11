'use client';

import { Header } from '@/components/stage/layout/Header';
import { VideoPanel } from '@/components/stage/video/VideoPanel';
import React from 'react';

interface SpeakerStageProps {
  eventId: string;
}

export function SpeakerStage({ eventId }: SpeakerStageProps) {
  return (
    <div className="flex flex-col flex-1 bg-white-500">
      {/* Video Area */}
      <div className="flex justify-center items-center flex-1 bg-white-500">
        {/* Shift box slightly to the right */}
        <div className="relative w-[650px] aspect-[4/3] rounded-lg  translate-x-4">
          <VideoPanel eventId={eventId} role="speaker" />
        </div>
      </div>
    </div>
  );
}
