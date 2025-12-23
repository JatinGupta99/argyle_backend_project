'use client';

import DailyRoom from '@/components/daily/DailyRoom';
import { DailyRoomAttendee } from '@/components/daily/DailyRoomAttendee';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { ROLEBASED } from '@/lib/types/daily';
import type { RootState } from '@/lib/store';
import { useDispatch, useSelector } from 'react-redux';

interface VideoPanelProps {
  eventId: string;
  role?: ROLEBASED;
}

export function VideoPanel({
  eventId,
  role = ROLEBASED.ATTENDEE,
}: VideoPanelProps) {
  const dispatch = useDispatch();
  const isLive = useSelector((state: RootState) => state.ui.isLive);
  const roomUrl = useSelector((state: RootState) => state.ui.roomUrl);

  // Try to read event context (provides startTime). If not available, fall back to now.
  let startTime = new Date();
  try {
    const ev = useEventContext();
    startTime = ev.schedule?.startTime ?? startTime;
  } catch (e) {
    // Not inside an EventContextProvider — that's fine, keep fallback startTime
  }

  return (
    <div className="flex flex-col h-full bg-background mt-2">
      <div className="relative flex-none w-full max-w-[600px] aspect-[16/12.5] bg-gray-900 rounded-2xl shadow-lg mx-auto">
        {isLive && roomUrl ? (
          // Use attendee-friendly wrapper which handles joining and countdowns.
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
