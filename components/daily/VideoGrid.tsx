'use client';
import React, { useMemo } from 'react';
import { useParticipants } from '@/hooks/useParticipants';
import { ParticipantState } from './ParticipantState';
import { VideoTile } from './VideoTile';
import { computeGrid } from '@/lib/utils';

export function VideoGrid() {
  const participantIds = useParticipants();

  const { cols, rows } = computeGrid(participantIds.length);

  return (
    <div className="h-full w-full p-2">
      <div
        className="grid gap-2 h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {participantIds.map((id) => (
          <ParticipantState key={id} id={id}>
            {(state) =>
              state.videoPlayable && (
                <VideoTile
                  id={state.id}
                  name={state.name}
                  isLocal={state.isLocal}
                  micOn={state.audioPlayable}
                  isActiveSpeaker={state.isActiveSpeaker}
                />
              )
            }
          </ParticipantState>
        ))}
      </div>
    </div>
  );
}
