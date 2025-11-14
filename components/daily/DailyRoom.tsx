'use client';

import { DailyProvider } from '@daily-co/daily-react';
import { VideoGrid } from './VideoGrid';
import { Event } from '@/lib/types/components';
import { useDailyRoomConnector } from '@/hooks/useDailyRoom';

export default function DailyRoom({ event, userId }: { event: Event; userId: string }) {
  const { callObject, isRoomReady, loading, error } = useDailyRoomConnector(event);

  if (loading) return <div>Joining room…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!isRoomReady || !callObject) return <div>Initializing…</div>;

  return (
    <DailyProvider callObject={callObject}>
      <VideoGrid />
    </DailyProvider>
  );
}
