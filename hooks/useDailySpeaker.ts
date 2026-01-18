'use client';

import { useState, useEffect } from 'react';
import { useDailyBase } from './useDailyBase';
import { Role, ROLES_ADMIN } from '@/app/auth/roles';
import { normalizeRole } from '@/app/auth/access';
import { useDailyMediaControls } from './useDailyMediaControls';
import { useLiveState } from './useLiveState';
import { mergeUserData } from '@/lib/utils/daily-utils';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';
import { fetchMeetingToken } from '@/lib/api/daily';
import { useMemo } from 'react';
import { getRoleConfig } from '@/app/auth/access';
import { useAuth } from '@/app/auth/auth-context';

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
  const { userData: contextUserData } = useAuth();
  const userData = useMemo(() => {
    if (contextUserData) return contextUserData;
    if (!token) return null;
    return extractUserDataFromToken(token);
  }, [token, contextUserData]);

  // Priority: Token-provided URL -> Prop-provided URL
  const finalRoomUrl = userData?.dailyUrl || roomUrl;

  // 0. Dynamic Token Acquisition
  const [meetingToken, setMeetingToken] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // We only fetch if we don't have a dynamic token yet and join is enabled
    // The 'token' prop is our browser JWT/Auth token
    if (enableJoin && eventId && token && !meetingToken && !isFetching) {
      console.log('[useDailySpeaker] Fetching fresh dynamic meeting token...');
      setIsFetching(true);
      fetchMeetingToken(eventId, token).then(newToken => {
        if (newToken) setMeetingToken(newToken);
        setIsFetching(false);
      });
    }
  }, [enableJoin, eventId, token, meetingToken, isFetching]);

  // Priority: API-provided token -> Token-provided Daily Token -> null
  const finalToken = meetingToken || userData?.dailyToken || null;

  // Use name from token if available
  const finalUserName = userData?.name || userName;

  // Connection - WAIT FOR TOKEN before enabling base connection to prevent join errors
  const isReadyToConnect = enableJoin && (!!finalToken || !token);

  const config = getRoleConfig(role);
  const startWithMedia = !config.start_audio_off && !config.start_video_off;

  const {
    callObject,
    ready,
    error: baseError,
  } = useDailyBase(
    finalRoomUrl,
    isReadyToConnect,
    finalUserName,
    finalToken || null,
    userData,
    startWithMedia
  );

  // 2. Hardware Controls (Synced Source of Truth)
  const media = useDailyMediaControls(callObject, role);

  // 3. Live State Management (Moderator only)
  const { isLive, isLoading, isRecording, toggleLive, endEvent } = useLiveState(callObject, eventId, roomUrl, role, initialIsLive);

  // 4. Local state for non-base errors
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (baseError) setError(baseError);
  }, [baseError]);

  const loading = !ready;


  // 5. Sync Role to userData for other participants to see
  useEffect(() => {
    if (ready && callObject && role) {
      console.log('[useDailySpeaker] Syncing role to userData:', role);
      mergeUserData(callObject, { role });
    }
  }, [ready, callObject, role]);

  // 6. Apply initial media states from config if necessary
  useEffect(() => {
    if (ready && callObject) {
      if (config.start_audio_off) callObject.setLocalAudio(false);
      if (config.start_video_off) callObject.setLocalVideo(false);
    }
  }, [ready, callObject, config.start_audio_off, config.start_video_off]);

  return {
    callObject,
    loading,
    ready,
    error,
    isLive,
    isLoading,
    isRecording,
    ...media,
    toggleMic: (role === ROLES_ADMIN.Speaker || role === ROLES_ADMIN.Moderator) ? media.toggleMic : async () => { },
    toggleCam: role === ROLES_ADMIN.Speaker ? media.toggleCam : async () => { },
    toggleLive: role === ROLES_ADMIN.Moderator ? toggleLive : async () => { },
    toggleScreenShare: (role === ROLES_ADMIN.Speaker || role === ROLES_ADMIN.Moderator) ? media.toggleScreenShare : async () => { },
    endEvent: role === ROLES_ADMIN.Moderator ? endEvent : async () => { },
  };
}
