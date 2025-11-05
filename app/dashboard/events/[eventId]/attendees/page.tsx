'use client';

import DailyRoom from '@/components/daily/page';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { DailyRoomUrl, EventId, UserID } from '@/lib/constants/api';

export default function AttendeeViewPage({
  params,
}: {
  params: { eventId: string };
}) {
  //  const { roomUrl, loading, error } = useDailyRoomUrl(eventId);
  const roomUrl = DailyRoomUrl;

  //  if (loading)
  //   return (
  //     <div className="flex items-center justify-center h-screen text-gray-500">
  //       Loading video session...
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <div className="flex items-center justify-center h-screen text-red-600 p-4">
  //       <p>{error}</p>
  //     </div>
  //   );

  if (!roomUrl)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No room found for this event.</p>
      </div>
    );
  return (
    <div className="flex h-screen">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Event Stage" />
        <div className="flex-1">
          <DailyRoom roomUrl={roomUrl} />
        </div>
      </div>
    </div>
  );
}
