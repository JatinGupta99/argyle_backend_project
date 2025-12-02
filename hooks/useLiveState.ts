import { toggleLiveState } from '@/lib/api/speaker';
import { DailyCall } from '@daily-co/daily-js';
import { useCallback, useState } from 'react';

export function useLiveState(callObject: DailyCall | null, eventId: string) {
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const toggleLive = useCallback(async () => {
    if (!callObject) return;

    const next = !isLive;
    setLoading(true);

    const success = await toggleLiveState(eventId, next);
    if (!success) return setLoading(false);
    callObject.setLocalAudio(next);
    callObject.setLocalVideo(next);

    setIsLive(next);
    setLoading(false);
  }, [callObject, eventId, isLive]);

  return { isLive, isLoading, toggleLive };
}
