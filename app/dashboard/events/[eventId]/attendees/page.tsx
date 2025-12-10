'use client';

import DailyRoom from '@/components/daily/DailyRoom';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice.ts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ROLEBASED, DailyTokenPayload } from '@/lib/types/daily';

interface TokenPayload {
  r: ROLEBASED;
  u?: string;
}

export default function AttendeeViewProfilePage({ inviteId }: { inviteId: string }) {
  const event = useEventContext();
  const { schedule } = event;

  const targetDate = new Date(schedule.startTime);
  const [eventIsLive, setEventIsLive] = useState<boolean>(new Date() >= targetDate);
  const [token, setToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [role, setRole] = useState<ROLEBASED>(ROLEBASED.ATTENDEE);

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

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get<{ data: { token: string; roomUrl: string } }>(`/api/invite/join/${inviteId}`);
        const { token, roomUrl } = res.data.data;
        setToken(token);
        setRoomUrl(roomUrl);
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.r ?? ROLEBASED.ATTENDEE);
      } catch (err) {
        console.error('Failed to fetch token:', err);
      }
    };
    fetchToken();
  }, [inviteId]);

  const chatType = eventIsLive ? ChatSessionType.LIVE : ChatSessionType.PRE_LIVE;

  if (role !== ROLEBASED.ATTENDEE) {
    return <div className="p-6 text-center text-red-600">You do not have access as an attendee.</div>;
  }

  return (
    <div className="bg-sky-50">
      <EventStageLayout
        role={RoleView.Attendee}
        chatType={chatType}
        chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
      >
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          {token && roomUrl ? (
            <DailyRoom
              token={token}
              startTime={targetDate}
              roomUrl={roomUrl}
              eventIsLive={eventIsLive}
            />
          ) : (
            <div>Loading meeting info…</div>
          )}
        </div>
      </EventStageLayout>
    </div>
  );
}
