'use client';

import { useEffect, useState } from 'react';
import DailyRoom from '@/components/daily/DailyRoom';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ROLEBASED } from '@/hooks/useDailyBase';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice.ts';
import { useEventContext } from '@/components/providers/EventContextProvider';

export default function AttendeeViewProfilePage() {
  const event = useEventContext();
  const { schedule, dailyRoomDetails } = event;

  const targetDate = new Date(schedule.startTime);

  const [eventIsLive, setEventIsLive] = useState<boolean>(
    new Date() >= targetDate
  );
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

  const chatType = eventIsLive
    ? ChatSessionType.LIVE
    : ChatSessionType.PRE_LIVE;

  return (
    <div className="bg-sky-50">
      <EventStageLayout
        role={RoleView.Attendee}
        chatType={chatType}
        chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
      >
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <DailyRoom
            role={ROLEBASED.ATTENDEE}
            startTime={targetDate}
            roomUrl={dailyRoomDetails.dailyRoomUrl}
            eventIsLive={eventIsLive}
          />
        </div>
      </EventStageLayout>
    </div>
  );
}
