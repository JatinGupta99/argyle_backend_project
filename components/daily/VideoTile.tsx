'use client';

import React from 'react';
import { DailyVideo } from '@daily-co/daily-react';
import { Mic, MicOff } from 'lucide-react';

interface VideoTileProps {
  id: string;
  name: string;
  isLocal: boolean;
  micOn: boolean;
  isActiveSpeaker: boolean;
  hasVideo?: boolean;
}

export const VideoTile = React.memo(function VideoTile({
  id,
  name,
  isLocal,
  micOn,
  isActiveSpeaker,
  hasVideo = true,
}: VideoTileProps) {
  return (
    <div
      className={`relative w-full h-full rounded-xl bg-black overflow-hidden ${
        isActiveSpeaker ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
      }`}
    >
      {hasVideo ? (
        <DailyVideo
          type="video"
          sessionId={id}
          className=" text-white w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-sm bg-gray-800"></div>
      )}

      <div className="absolute bottom-0 left-0 w-full bg-black/75 px-3 py-1 flex justify-between text-white text-xs">
        <span>{isLocal ? 'You' : name || id}</span>
        {micOn ? (
          <Mic className="w-4 h-4 text-green-400" />
        ) : (
          <MicOff className="w-4 h-4 text-red-500" />
        )}
      </div>
    </div>
  );
});
