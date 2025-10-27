'use client';

import DailyRoom from '@/components/daily/page';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { useDailyRoom } from '@/hooks/useDailyRoom';
import { DailyRoomUrl, EventId, UserID } from '@/lib/constants/api';

interface AttendeeViewPageProps {
  params: { eventId: string };
}

export default function AttendeeViewPage({ params }: AttendeeViewPageProps) {
  const { callObject, loading, error } = useDailyRoom({
    roomUrl: DailyRoomUrl,
  });

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
    <div className="flex h-screen">
      {/* Chat Panel */}
      <div className="w-[310px] border-r border-gray-200 flex-shrink-0">
        <ChatPanel
          title1="Everyone"
          title2="Backstage"
          title3="Everyone"
          role="attendee"
          eventId={EventId}
          currentUserId={UserID}
        />
      </div>

      {/* Daily Room (takes remaining space) */}
      <div className="flex-1 overflow-hidden">
        <Header title="" />
        <DailyRoom callObject={callObject} roomUrl={DailyRoomUrl} />
      </div>
    </div>
  );
}
