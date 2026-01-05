'use client';

import DailyRoom from '@/components/daily/DailyRoom';
import { DailyRoomAttendee } from '@/components/daily/DailyRoomAttendee';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { Role, ROLES } from '@/app/auth/roles';
import type { RootState } from '@/lib/store';
import { useDispatch, useSelector } from 'react-redux';

interface VideoPanelProps {
  eventId: string;
  role?: Role;
}

export function VideoPanel({
  eventId,
  role = ROLES.ATTENDEE,
}: VideoPanelProps) {
  const dispatch = useDispatch();
  const isLive = useSelector((state: RootState) => state.ui.isLive);
  const roomUrl = useSelector((state: RootState) => state.ui.roomUrl);
  let startTime = new Date();
  try {
    const ev = useEventContext();
    startTime = ev.schedule?.startTime ?? startTime;
  } catch (e) {
  }

  return (
    <div className="flex flex-col h-full bg-background mt-2">
      <div className="relative flex-none w-full max-w-[600px] aspect-[16/12.5] bg-gray-900 rounded-2xl shadow-lg mx-auto">
        {isLive && roomUrl ? (
          <DailyRoomAttendee
            role={role}
            startTime={startTime}
            roomUrl={roomUrl!}
            eventIsLive={isLive}
            eventId={eventId}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-white text-lg font-semibold">Event Not Live</h3>
            <p className="text-gray-400 text-sm mt-2">
              Waiting for the host to start the event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
