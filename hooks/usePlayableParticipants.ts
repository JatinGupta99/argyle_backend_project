'use client';
import { useState, useEffect } from 'react';
import { useDaily, useParticipantIds } from '@daily-co/daily-react';

/**
 * ✅ Safely returns all participant IDs whose video track is currently playable.
 * This version does NOT violate React's Rules of Hooks.
 */
export function usePlayableParticipants() {
  const daily = useDaily();
  const participantIds = useParticipantIds(); // includes local + remote participants
  const [playableIds, setPlayableIds] = useState<string[]>([]);

  useEffect(() => {
    if (!daily) return;

    const updatePlayable = () => {
      const allParticipants = daily.participants();
      const newPlayableIds = Object.entries(allParticipants)
        .filter(
          ([, participant]) =>
            participant.tracks?.video?.state === 'playable'
        )
        .map(([id]) => id);
      setPlayableIds(newPlayableIds);
    };

    // Initial check
    updatePlayable();

    // Subscribe to track updates from Daily
    daily.on('participant-updated', updatePlayable);
    daily.on('participant-joined', updatePlayable);
    daily.on('participant-left', updatePlayable);

    // Cleanup listeners on unmount
    return () => {
      daily.off('participant-updated', updatePlayable);
      daily.off('participant-joined', updatePlayable);
      daily.off('participant-left', updatePlayable);
    };
  }, [daily, participantIds]);

  return playableIds;
}