'use client';

import DailyRoom from '@/components/daily/page';
import { useDailyRoom } from '@/hooks/useDailyRoom';

interface AttendeeViewPageProps {
  params: { eventId: string };
}

export default function AttendeeViewPage({ params }: AttendeeViewPageProps) {
  const { callObject, roomUrl, loading, error } = useDailyRoom(params.eventId);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading video session...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 p-4">
        <p>{error}</p>
      </div>
    );

  if (!callObject)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Unable to initialize call</p>
      </div>
    );

  return (
      <DailyRoom callObject={callObject} roomUrl={roomUrl} />
  );
}
