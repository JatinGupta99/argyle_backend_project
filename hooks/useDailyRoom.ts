'use client';

import { useDailyBase } from './useDailyBase';

interface UseDailyRoomOptions {
  roomUrl: string;
}

export function useDailyRoom({ roomUrl }: UseDailyRoomOptions) {
  const { callObject, ready, error } = useDailyBase(roomUrl, true, 'Guest');

  return {
    callObject,
    loading: !ready && !error,
    error
  };
}
