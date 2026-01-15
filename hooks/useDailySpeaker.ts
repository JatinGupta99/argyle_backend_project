'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDailyBase } from './useDailyBase';
import { Role, ROLES_ADMIN } from '@/app/auth/roles';
import { normalizeRole } from '@/app/auth/access';
import { useDailyMediaControls } from './useDailyMediaControls';
import { useLiveState } from './useLiveState';
import { mergeUserData } from '@/lib/utils/daily-utils';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';
import { useMemo } from 'react';

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
  userName = ROLES_ADMIN.Speaker,
  token,
  enableJoin = true,
  initialIsLive = false
}: UseDailySpeakerProps) {
  const role = normalizeRole(initialRole);
  const userData = useMemo(() => {
    if (!token) return null;
    return extractUserDataFromToken(token);
  }, [token]);

  // Priority: Token-provided URL -> Prop-provided URL
  const finalRoomUrl = userData?.dailyUrl || roomUrl;
  // Priority: Token-provided Daily Token -> Prop-provided Token
  const finalToken = userData?.dailyToken || token;
  // Use name from token if available
  const finalUserName = userData?.name || userName;

  // 1. Core Connection
  const {
    callObject,
    ready,
    error: baseError,
  } = useDailyBase(finalRoomUrl, enableJoin, finalUserName, finalToken || null, userData);

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
  const isModerator = role === ROLES_ADMIN.Moderator;

  // 5. Sync Role to userData for other participants to see
  useEffect(() => {
    if (ready && callObject && role) {
      console.log('[useDailySpeaker] Syncing role to userData:', role);
      mergeUserData(callObject, { role });
    }
  }, [ready, callObject, role]);

  // 6. Default Moderators to OFF (Camera/Mic)
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
    toggleLive: role === ROLES_ADMIN.Moderator ? toggleLive : async () => { },
    endEvent: role === ROLES_ADMIN.Moderator ? endEvent : async () => { },
  };
}
