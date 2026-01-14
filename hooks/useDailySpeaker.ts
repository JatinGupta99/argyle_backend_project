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

/**
 * useDailySpeaker - Professional high-privilege role controller
 * 
 * Consolidates hardware, live-state, and foundation logic for Speakers and Moderators.
 */
export function useDailySpeaker({
  roomUrl,
  eventId,
  role: initialRole,
  userName = ROLES.SPEAKER,
  token,
  enableJoin = true,
  initialIsLive = false
}: UseDailySpeakerProps) {
  const role = normalizeRole(initialRole);

  // 1. Core Connection
  const {
    callObject,
    ready,
    error: baseError,
  } = useDailyBase(roomUrl, enableJoin, userName, token || null);

  // 2. Hardware Controls (Synced Source of Truth)
  const media = useDailyMediaControls(callObject);

  // 3. Live State Management (Moderator only)
  const { isLive, isLoading, isRecording, toggleLive, endEvent } = useLiveState(callObject, eventId, roomUrl, initialIsLive);

  // 4. Local state for non-base errors
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (baseError) setError(baseError);
  }, [baseError]);

  const loading = !ready;
  const isModerator = role === ROLES.MODERATOR;

  // 5. Default Moderators to OFF (Camera/Mic)
  useEffect(() => {
    if (ready && callObject && isModerator) {
      console.log('[useDailySpeaker] Auto-muting Moderator on join');
      callObject.setLocalAudio(false);
      callObject.setLocalVideo(false);
    }
  }, [ready, callObject, isModerator]);

  return {
    callObject,
    loading,
    ready,
    error,
    isLive,
    isLoading,
    isRecording,
    ...media,
    toggleLive: role === ROLES.MODERATOR ? toggleLive : async () => { },
    endEvent: role === ROLES.MODERATOR ? endEvent : async () => { },
  };
}
