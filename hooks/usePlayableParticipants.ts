'use client';
import { useState, useEffect, useCallback } from 'react';
import { useDaily, useParticipantIds } from '@daily-co/daily-react';

export function usePlayableParticipants() {
  const daily = useDaily();
  const participantIds = useParticipantIds();
  const [playableIds, setPlayableIds] = useState<string[]>([]);

  const updatePlayable = useCallback(() => {
    if (!daily) return;

    const allParticipants = daily.participants();
    const newPlayableIds = Object.entries(allParticipants)
      .filter(
        ([, participant]) => participant?.tracks?.video?.state === 'playable'
      )
      .map(([id]) => id);

    setPlayableIds(newPlayableIds);
  }, [daily]);

  useEffect(() => {
    if (!daily) return;

    updatePlayable();

    daily.on('participant-joined', updatePlayable);
    daily.on('participant-updated', updatePlayable);
    daily.on('participant-left', updatePlayable);

    return () => {
      daily.off('participant-joined', updatePlayable);
      daily.off('participant-updated', updatePlayable);
      daily.off('participant-left', updatePlayable);
    };
  }, [daily, updatePlayable]);

  useEffect(() => {
    updatePlayable();
  }, [participantIds, updatePlayable]);

  return playableIds;
}
