'use client';
import { useDailyActiveSpeaker } from '@/hooks/useDailyActiveSpeaker';
import { useParticipantProperty } from '@daily-co/daily-react';
import React from 'react';

export interface ParticipantProps {
  id: string;
  children: (state: {
    id: string;
    name: string;
    isLocal: boolean;
    videoPlayable: boolean;
    audioPlayable: boolean;
    isActiveSpeaker: boolean;
  }) => React.ReactNode;
}

export function ParticipantState({ id, children }: ParticipantProps) {
  const name = useParticipantProperty(id, 'user_name');
  const isLocal = useParticipantProperty(id, 'local');
  const videoState = useParticipantProperty(id, 'tracks.video.state');
  const audioState = useParticipantProperty(id, 'tracks.audio.state');

  const activeSpeakerId = useDailyActiveSpeaker();
  const isActiveSpeaker = id === activeSpeakerId;

  return (
    <>
      {children({
        id,
        name,
        isLocal,
        videoPlayable: videoState === 'playable',
        audioPlayable: audioState === 'playable',
        isActiveSpeaker,
      })}
    </>
  );
}
