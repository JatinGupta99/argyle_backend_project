'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types/components';
import { Role, ROLES_ADMIN } from '@/app/auth/roles';
import { useDailyBase } from './useDailyBase';
import { useDailyMediaControls } from './useDailyMediaControls';
import { useLiveState } from './useLiveState';
import { fetchMeetingToken } from '@/lib/api/daily';
import { useAuth } from '@/app/auth/auth-context';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';
import { useMemo } from 'react';

export function useEventRole(event: Event, role: Role) {
  const eventId = event?._id;
  const roomUrl = event?.dailyRoomDetails?.dailyRoomUrl;
  const { token: authToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  const userData = useMemo(() => {
    if (!authToken) return null;
    return extractUserDataFromToken(authToken);
  }, [authToken]);

  useEffect(() => {
    // If token has a dailyToken, use it immediately
    if (userData?.dailyToken) {
      setToken(userData.dailyToken);
      return;
    }
    // Otherwise fetch if moderator
    if (role === ROLES_ADMIN.Moderator && eventId) {
      fetchMeetingToken(eventId, authToken).then(setToken);
    }
  }, [eventId, role, userData?.dailyToken, authToken]);

  const finalRoomUrl = userData?.dailyUrl || roomUrl;
  const finalDisplayName = userData?.name || '';

  // (roomUrl, enable, userName, token, userData)
  const base = useDailyBase(finalRoomUrl, true, finalDisplayName, token, userData);
  const media =
    role === ROLES_ADMIN.Attendee
      ? {
        isMicOn: false,
        isCamOn: false,
        isScreenSharing: false,
        toggleMic: () => { },
        toggleCam: () => { },
        toggleScreenShare: async () => { },
      }
      : useDailyMediaControls(base.callObject);
  const live =
    role === ROLES_ADMIN.Moderator
      ? useLiveState(base.callObject, eventId, roomUrl || '')
      : { isLive: false, toggleLive: undefined, isLoading: false };
  // Removed auto-mute logic. Moderators should start with default state or controlled by UI.
  // Previous code forced setLocalVideo(false) which caused "camera always disabled" report.

  return {
    ...base,
    ...media,
    ...live,
  };
}
