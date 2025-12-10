'use client';

import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { RoleView } from '@/lib/slices/uiSlice.ts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DailyRoom from '@/components/daily/DailyRoom';
import { ROLEBASED, DailyTokenPayload, DailyJoinResponse } from '@/lib/types/daily';
import { jwtDecode } from 'jwt-decode';

export default function SpeakerPage() {
  const event = useEventContext();
  const { schedule } = event;

  const targetDate = new Date(schedule.startTime);
  const [eventIsLive, setEventIsLive] = useState<boolean>(new Date() >= targetDate);

  const [token, setToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [role, setRole] = useState<ROLEBASED | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventIsLive) return;
    const interval = setInterval(() => {
      if (new Date() >= targetDate) {
        setEventIsLive(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, eventIsLive]);

  // Fetch token & room URL from API
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get<{ data: DailyJoinResponse }>(
          `/api/invite/join/${event._id}`
        );
        const { token, roomUrl } = res.data.data;

        setToken(token);
        setRoomUrl(roomUrl);
        const decoded = jwtDecode<DailyTokenPayload>(token);
        const extractedRole = (decoded.r as ROLEBASED) ?? ROLEBASED.ATTENDEE;
        setRole(extractedRole);

        if (extractedRole !== ROLEBASED.SPEAKER && extractedRole !== ROLEBASED.MODERATOR) {
          setError('Access denied: This area is for speakers and moderators only.');
        }
      } catch (err) {
        console.error('Failed to fetch token:', err);
        setError('Failed to load speaker access. Please ensure you have speaker permissions.');
      }
    };

    fetchToken();
  }, [event._id]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="p-8 text-center bg-gray-800 rounded-lg shadow-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold mb-3 text-white">Access Denied</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!token || !roomUrl || role === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-lg">Loading speaker access...</div>
      </div>
    );
  }

  return (
    <EventStageLayout
      role={RoleView.Speaker}
      chatType={ChatSessionType.LIVE}
      chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
      title={'Argyle'}
    >
      <div className="flex-1 overflow-hidden -mt-4">
        <DailyRoom
          token={token}
          startTime={targetDate}
          roomUrl={roomUrl}
          eventIsLive={eventIsLive}
        />
      </div>
    </EventStageLayout>
  );
}
