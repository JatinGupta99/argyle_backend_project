'use client';
import { useEffect, useState } from 'react';
import { useDaily } from '@daily-co/daily-react';

export function useDailyActiveSpeaker() {
  const daily = useDaily();
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  useEffect(() => {
    if (!daily) return;

    const handleAudioLevels = (event: any) => {
      const participantsAudio = event.participantsAudioLevel || {};
      let maxLevel = 0;
      let activeId: string | null = null;

      Object.entries(participantsAudio).forEach(
        ([id, level]: [string, any]) => {
          if (level > maxLevel) {
            maxLevel = level;
            activeId = id;
          }
        }
      );

      if (activeId) setActiveSpeakerId(activeId);
    };

    daily.on('remote-participants-audio-level', handleAudioLevels);

    return () => {
      daily.off('remote-participants-audio-level', handleAudioLevels);
    };
  }, [daily]);

  return activeSpeakerId;
}
