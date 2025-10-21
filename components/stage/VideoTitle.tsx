'use client';

import React, { useRef, useEffect } from 'react';
import { VolumeX } from 'lucide-react';
import { useParticipantProperty } from '@daily-co/daily-react';
import type { DailyTrackState } from '@daily-co/daily-react';

interface VideoTileProps {
  participantId: string;
}

export default function VideoTile({ participantId }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoState = useParticipantProperty(
    participantId,
    'tracks.video.state'
  ) as DailyTrackState['state'];
  const videoTrack = useParticipantProperty(
    participantId,
    'tracks.video.track'
  ) as DailyTrackState['track'];
  const isLocal = useParticipantProperty(participantId, 'local') as boolean;
  const audioState = useParticipantProperty(
    participantId,
    'tracks.audio.state'
  ) as DailyTrackState['state'];
  const userName = useParticipantProperty(participantId, 'user_name') as
    | string
    | null;

  useEffect(() => {
    if (videoTrack && videoRef.current) {
      const mediaStream = new MediaStream([videoTrack]);
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoTrack]);

  return (
    <div className="relative rounded-lg overflow-hidden border shadow-sm bg-gray-100 flex items-center justify-center aspect-video">
      {videoState === 'playable' && videoTrack ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="object-cover w-full h-full"
          style={{ transform: isLocal ? 'scaleX(-1)' : 'none' }}
        />
      ) : (
        <div className="flex items-center justify-center text-white p-4">
          <p className="text-center">No video available</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white px-2 py-1 text-sm flex justify-between items-center">
        <span>{userName || participantId}</span>
        {audioState === 'off' && <VolumeX className="h-4 w-4 text-red-400" />}
      </div>
    </div>
  );
}
