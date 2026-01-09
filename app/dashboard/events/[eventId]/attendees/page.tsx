'use client';

import { CountdownDisplay } from '@/components/shared/CountdownDisplay';
import { DailyRoomAttendee } from '@/components/daily/DailyRoomAttendee';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice';
import { useEffect, useState } from 'react';

export default function AttendeeViewProfilePage() {
  const event = useEventContext();
  const { schedule, dailyRoomDetails } = event;

  const targetDate = schedule?.startTime instanceof Date
    ? schedule.startTime
    : new Date(schedule?.startTime || Date.now());

  const [eventIsLive, setEventIsLive] = useState<boolean>(
    new Date() >= targetDate
  );
  useEffect(() => {
    if (eventIsLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
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
    <div className="h-full w-full">
      <EventStageLayout
        role={RoleView.Attendee}
        chatType={chatType}
        chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
      >
        <div className="flex-1 h-full relative">
          {!eventIsLive ? (
            <div className="absolute inset-0 bg-black">
              <CountdownDisplay
                startTime={targetDate}
                eventTitle={event.title || 'Live Event'}
                logoUrl={event.eventLogoUrl}
                onTimerComplete={() => setEventIsLive(true)}
              />
            </div>
          ) : (
            <div className="flex-1 flex h-full items-center justify-center p-4">
              <DailyRoomAttendee
                role={RoleView.Attendee}
                startTime={targetDate}
                roomUrl={dailyRoomDetails?.dailyRoomUrl || ''}
                eventIsLive={eventIsLive}
                eventId={event._id || ''}
              />
            </div>
          )}
        </div>
      </EventStageLayout>
    </div>
  );
}