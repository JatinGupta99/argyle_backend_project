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

  const [isTimeReached, setIsTimeReached] = useState<boolean>(
    new Date() >= targetDate
  );

  useEffect(() => {
    if (isTimeReached) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
        setIsTimeReached(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isTimeReached]);

  const isLive = event.status === 'LIVE' && isTimeReached;

  const chatType = isLive
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
          {!isLive ? (
            <div className="absolute inset-0 bg-black">
              <CountdownDisplay
                startTime={targetDate}
                eventTitle={event.title || 'Live Event'}
                logoUrl={event.eventLogoUrl}
                onTimerComplete={() => setIsTimeReached(true)}
              />
              {/* Optional: Add a message if time is reached but host is not live yet */}
              {isTimeReached && event.status !== 'LIVE' && (
                <div className="absolute bottom-20 left-0 right-0 text-center text-white/80 animate-pulse">
                  Waiting for host to go live...
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex h-full items-center justify-center p-4">
              <DailyRoomAttendee
                role={RoleView.Attendee}
                startTime={targetDate}
                roomUrl={dailyRoomDetails?.dailyRoomUrl || ''}
                eventIsLive={isLive}
                eventId={event._id || ''}
              />
            </div>
          )}
        </div>
      </EventStageLayout>
    </div>
  );
}