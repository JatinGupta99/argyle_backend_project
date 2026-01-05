'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types/components';
import { Role, ROLES } from '@/app/auth/roles';
import { useDailyBase } from './useDailyBase';
import { useDailyMediaControls } from './useDailyMediaControls';
import { useLiveState } from './useLiveState';
import { fetchMeetingToken } from '@/lib/api/daily';

export function useEventRole(event: Event, role: Role) {
  const eventId = event?._id;
  const roomUrl = event?.dailyRoomDetails?.dailyRoomUrl;
  const displayName = event?.title || 'Guest';

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (role === ROLES.MODERATOR && eventId) {
      fetchMeetingToken(eventId).then(setToken);
    }
  }, [eventId, role]);
  const base = useDailyBase(roomUrl, true, displayName, token);
  const media =
    role === ROLES.ATTENDEE
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
    role === ROLES.MODERATOR
      ? useLiveState(base.callObject, eventId)
      : { isLive: false, toggleLive: undefined, isLoading: false };
  return {
    ...base,
    ...media,
    ...live,
  };
}
