'use client';

import React from 'react';
import { useParticipantIds } from '@daily-co/daily-react';
import VideoTile from './Tiles';
import useGridLayout from '@/hooks/useGridLayout';

export default function VideoGrid() {
  const participantIds = useParticipantIds();
  const gridStyle = useGridLayout(participantIds.length);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="grid gap-5 h-full w-full" style={gridStyle}>
        {participantIds.map((id) => (
          <VideoTile key={id} participantId={id} />
        ))}
      </div>
    </div>
  );
}
