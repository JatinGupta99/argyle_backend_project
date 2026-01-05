'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDailyBase } from './useDailyBase';
import { Role, ROLES } from '@/app/auth/roles';
import { normalizeRole } from '@/app/auth/access';
import { useDailyMediaControls } from './useDailyMediaControls';
import { useLiveState } from './useLiveState';

interface UseDailySpeakerProps {
  roomUrl: string;
  eventId: string;
  role?: Role | string;
  userName?: string;
  token?: string | null;
  enableJoin?: boolean;
  initialIsLive?: boolean;
}

export function useDailySpeaker({
  roomUrl,
  eventId,
  role: initialRole,
  userName = ROLES.SPEAKER,
  token,
  enableJoin = true
}: UseDailySpeakerProps) {
  const role = normalizeRole(initialRole);
  const {
    callObject,
    ready,
    error: baseError,
  } = useDailyBase(roomUrl, enableJoin, userName, token || null);
  const media = useDailyMediaControls(callObject);
  const { isLive, isLoading, toggleLive } = useLiveState(callObject, eventId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (baseError) setError(baseError);
  }, [baseError]);

  const loading = !ready;

  return {
    callObject,
    loading,
    ready,
    error,
    isLive,
    isLoading,
    ...media,
    toggleLive: role === ROLES.MODERATOR ? toggleLive : async () => { },
  };
}
