'use client';
import DailyRoom from '@/components/daily/DailyRoom';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

export default function AttendeeViewProfilePage() {
  const event = useEventContext();
  const userId = UserID;
  const EventId=event._id;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
            <ChatPanel
              title3={ChatTab.Everyone}
              role={RoleView.Attendee}
              eventId={EventId}
              currentUserId={userId}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
            />
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden bg-white">
            <Header title={event.title || 'Loading Event...'} />
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <DailyRoom event={event} userId={userId} />

            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
