'use client';

import { Header } from '@/components/stage/layout/Header';
import { VideoPanel } from '@/components/stage/video/VideoPanel';
import React from 'react';

interface SpeakerStageProps {
  eventId: string;
}

export function SpeakerStage({ eventId }: SpeakerStageProps) {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header title="Speaker Backstage" />

      {/* Video Area */}
      <div className="flex justify-center items-center flex-1 bg-black">
        <div className="relative w-[700px] aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
          <VideoPanel eventId={eventId} role="speaker" />
        </div>
      </div>
    </div>
  );
}
