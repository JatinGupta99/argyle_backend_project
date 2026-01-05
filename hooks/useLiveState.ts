import { toggleLiveState } from '@/lib/api/speaker';
import { DailyCall } from '@daily-co/daily-js';
import { useCallback, useState } from 'react';

export function useLiveState(callObject: DailyCall | null, eventId: string) {
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const toggleLive = useCallback(async () => {
    if (!callObject || !eventId) return;

    const nextLiveState = !isLive;
    setLoading(true);

    try {

      const success = await toggleLiveState(eventId, nextLiveState);
      if (!success) throw new Error('Failed to update live state via API');

      callObject.setLocalAudio(nextLiveState);
      callObject.setLocalVideo(nextLiveState);

      setIsLive(nextLiveState);
    } catch (err) {
      console.error('[LiveState] Toggle failed:', err);
    } finally {
      setLoading(false);
    }
  }, [callObject, eventId, isLive]);

  return { isLive, isLoading, toggleLive };
}
