'use client';

import { useParticipantProperty, useActiveSpeakerId } from '@daily-co/daily-react';
import React, { useEffect } from 'react';

export interface ParticipantProps {
  id: string;
  children: (state: {
    id: string;
    name: string;
    isLocal: boolean;
    videoPlayable: boolean;
    audioPlayable: boolean;
    isActiveSpeaker: boolean;
    isOwner: boolean;
    role: string | null;
  }) => React.ReactNode;
}

export function ParticipantState({ id, children }: ParticipantProps) {
  const name = useParticipantProperty(id, 'user_name');
  const isLocal = useParticipantProperty(id, 'local');
  const tracks = useParticipantProperty(id, 'tracks');

  const videoState = tracks?.video?.state;
  const audioState = tracks?.audio?.state;

  const isOwner = useParticipantProperty(id, 'owner');
  const userData = useParticipantProperty(id, 'userData') as any;
  const role = userData?.role || userData?.participantType || userData?.participant_type || null;

  const activeSpeakerId = useActiveSpeakerId();
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
        isOwner: !!isOwner,
        role,
      })}
    </>
  );
}
