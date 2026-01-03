import { toggleLiveState } from '@/lib/api/speaker';
import { DailyCall } from '@daily-co/daily-js';
import { useCallback, useState } from 'react';

/**
 * useLiveState - Professional broadcast management
 * 
 * Manages the platform's live status and ensures hardware tracks are 
 * properly initialized/shut-down during broadcast transitions.
 */
export function useLiveState(callObject: DailyCall | null, eventId: string) {
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const toggleLive = useCallback(async () => {
    if (!callObject || !eventId) return;

    const nextLiveState = !isLive;
    setLoading(true);

    try {
      // 1. Update the backend state via API
      const success = await toggleLiveState(eventId, nextLiveState);
      if (!success) throw new Error('Failed to update live state via API');

      // 2. Sync local media with the live state 
      // (Turn on mic/cam for broadcast, turn off when ending)
      // Note: useDailyMediaControls will automatically catch these via event listeners
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
