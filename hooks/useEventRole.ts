'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/types/components';
import { ROLEBASED, useDailyBase } from './useDailyBase';
import { useDailyMediaControls } from './useDailyMediaControls';
import { useLiveState } from './useLiveState';
import { fetchMeetingToken } from '@/lib/api/daily';

export function useEventRole(event: Event, role: ROLEBASED) {
  const eventId = event?._id;
  const roomUrl = event?.dailyRoomDetails?.dailyRoomUrl;
  const displayName = event?.title || 'Guest';

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only moderators need to fetch a token this way (Speakers use useDailySpeaker)
    if (role === ROLEBASED.MODERATOR && eventId) {
      fetchMeetingToken(eventId).then(setToken);
    }
  }, [eventId, role]);

  // (roomUrl, enable, userName, token)
  const base = useDailyBase(roomUrl, true, displayName, token);
  const media =
    role === ROLEBASED.ATTENDEE
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
    role === ROLEBASED.MODERATOR
      ? useLiveState(base.callObject, eventId)
      : { isLive: false, toggleLive: undefined, isLoading: false };
  return {
    ...base,
    ...media,
    ...live,
  };
}
