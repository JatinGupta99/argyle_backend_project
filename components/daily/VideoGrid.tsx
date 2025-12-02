'use client';

import { ROLEBASED } from '@/hooks/useDailyBase';
import { useParticipants } from '@/hooks/useParticipants';
import { computeGrid } from '@/lib/utils';
import { DailyCall } from '@daily-co/daily-js';
import { ParticipantState } from './ParticipantState';
import { VideoTile } from './VideoTile';

interface VideoGridProps {
  callObject: DailyCall;
  role?: ROLEBASED;
}

export function VideoGrid({ callObject, role }: VideoGridProps) {
  const participantIds = useParticipants();

  const filteredIds = participantIds.filter(
    (id) => !!callObject.participants()?.[id]
  );

  if (!filteredIds.length) {
    return (
      <div className=" bg-black h-full w-full flex items-center justify-center text-white text-lg">
        Waiting for participants to join…
      </div>
    );
  }

  const { cols, rows } = computeGrid(filteredIds.length);

  const allCamerasOff = filteredIds.every((id) => {
    const tracks = callObject.participants()?.[id]?.tracks;
    return tracks?.video?.state !== 'playable';
  });

  if (allCamerasOff) {
    return (
      <div className="h-full w-full relative bg-white flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center text-black text-lg font-semibold">
          Speakers are live, but their cameras are off.
        </div>

        {/* Still render the grid underneath (optional) */}
        <div
          className="grid gap-2 h-full w-full opacity-20"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {filteredIds.map((id) => (
            <ParticipantState key={id} id={id}>
              {(state) => (
                <VideoTile
                  id={state.id}
                  name={state.name}
                  isLocal={state.isLocal}
                  micOn={state.audioPlayable}
                  isActiveSpeaker={state.isActiveSpeaker}
                  hasVideo={state.videoPlayable}
                />
              )}
            </ParticipantState>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-2">
      <div
        className="grid gap-2 h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {filteredIds.map((id) => (
          <ParticipantState key={id} id={id}>
            {(state) => (
              <VideoTile
                id={state.id}
                name={state.name}
                isLocal={state.isLocal}
                micOn={state.audioPlayable}
                isActiveSpeaker={state.isActiveSpeaker}
                hasVideo={state.videoPlayable}
              />
            )}
          </ParticipantState>
        ))}
      </div>
    </div>
  );
}
