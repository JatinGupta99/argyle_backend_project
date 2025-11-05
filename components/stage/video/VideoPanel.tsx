'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setLive, setRoomUrl } from '@/lib/slices/uiSlice.ts';
import type { RootState } from '@/lib/store';
import { useState } from 'react';
import DailyVideoGrid from './DailyVideoGrid';
import { Button } from '../../ui/button';

interface VideoPanelProps {
  eventId: string;
  role?: 'attendee' | 'speaker' | 'organizer';
}

export function VideoPanel({ eventId, role = 'attendee' }: VideoPanelProps) {
  const dispatch = useDispatch();
  const isLive = useSelector((state: RootState) => state.ui.isLive);
  const roomUrl = useSelector((state: RootState) => state.ui.roomUrl);
  const [loading, setLoading] = useState(false);

  async function handleGoLive() {
    try {
      setLoading(true);
      if (!isLive) {
        const res = await fetch(`/api/events/${eventId}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch event details');

        const data = await res.json();
        const url = data?.dailyRoomDetails?.dailyRoomUrl;
        const status = data?.dailyRoomDetails?.dailyRoomStatus;

        if (!url || status !== 'active') {
          throw new Error('Daily room is not available for this event');
        }

        dispatch(setRoomUrl(url));
        dispatch(setLive(true));
      } else {
        dispatch(setLive(false));
        dispatch(setRoomUrl(null));
      }
    } catch (e: any) {
      console.error('[VideoPanel] Go Live error:', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-background pb-8 mt-2">
      <div className="relative flex-none w-full aspect-[4/3] bg-gray-900 rounded-2xl shadow-lg">
        {isLive && roomUrl ? (
          <DailyVideoGrid roomUrl={roomUrl} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <h3 className="text-white text-lg font-semibold">Event Not Live</h3>
            <p className="text-gray-400 text-sm mt-2">
              Waiting for the host to start the event.
            </p>
          </div>
        )}
      </div>

      {role !== 'attendee' && (
        <div className="mt-2 text-center">
          <Button
            onClick={handleGoLive}
            disabled={loading}
            className="bg-sky-400 hover:bg-sky-500 text-white"
          >
            {loading ? 'Loading...' : isLive ? 'End Live' : 'Go Live'}
          </Button>
        </div>
      )}
    </div>
  );
}
