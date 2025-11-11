'use client';
import { DailyVideo, useParticipantProperty } from '@daily-co/daily-react';
import { Mic, MicOff } from 'lucide-react';

interface VideoTileProps {
  id: string;
}

export function VideoTile({ id }: VideoTileProps) {
  const userName = useParticipantProperty(id, 'user_name');
  const isLocal = useParticipantProperty(id, 'local');
  const videoState = useParticipantProperty(id, 'tracks.video.state');
  const audioState = useParticipantProperty(id, 'tracks.audio.state');

  if (videoState !== 'playable') return null;
  const isMicOn = audioState === 'playable';

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md bg-black">
      {/* Video Layer */}
      <DailyVideo
        type="video"
        sessionId={id}
        className="!w-full !h-full !object-cover !object-center"
      />

      {/* Overlay */}
      <div
  className="
    absolute
    bottom-0
    left-0
    w-full
    bg-black/80
    backdrop-blur-md
    flex
    items-center
    justify-between
    px-4
    py-2
    text-sm
    text-white
    rounded-b-xl
  "
>
  <span className="truncate">
    {isLocal ? 'You' : userName || `User: ${id.slice(0, 4)}...`}
  </span>
  {isMicOn ? (
    <Mic className="w-5 h-5 text-green-400" />
  ) : (
    <MicOff className="w-5 h-5 text-red-500" />
  )}
</div>
    </div>
  );
}
