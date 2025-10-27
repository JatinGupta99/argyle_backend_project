import useDailyVideoGrid from '@/hooks/useGridLayout';
import React from 'react';

export default function DailyVideoGrid({ participants }) {
  const {
    gridTemplateColumns,
    gridTemplateRows,
    participants: layoutParticipants,
  } = useDailyVideoGrid(participants);

  return (
    <div
      className="w-full h-full gap-2 grid bg-gray-100 p-2"
      style={{ gridTemplateColumns, gridTemplateRows }}
    >
      {layoutParticipants.map((participant) => (
        <div
          key={participant.id}
          className="bg-black relative rounded overflow-hidden flex items-center justify-center text-white"
        >
          {participant.videoStream ? (
            <video
              className="w-full h-full object-cover"
              ref={(video) => {
                if (video && participant.videoStream) {
                  video.srcObject = participant.videoStream;
                  video.play().catch(() => {});
                }
              }}
              muted
            />
          ) : (
            <span className="text-sm">{participant.name}</span>
          )}
          <div className="absolute bottom-1 left-1 bg-black/50 text-xs px-1 rounded">
            {participant.name}
          </div>
        </div>
      ))}
    </div>
  );
}
