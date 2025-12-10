'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { EventHeader } from '@/components/stage/event-headers';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ROLEBASED } from '@/hooks/useDailyBase';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
export default function Page() {
  const event = useEventContext();
  const eventId = event._id as string;
  const userId = UserID;
  const role=ROLEBASED.ATTENDEE

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
          <aside className="w-[310px] border-r border-gray-200 bg-white">
            <ChatPanel
              title3={ChatTab.Argyle}
              role={RoleView.Attendee}
              eventId={eventId}
              currentUserId={userId}
              type={ChatSessionType.PRE_LIVE}
              tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
            />
          </aside>
          <main className="flex-1 flex flex-col overflow-hidden">
            <Header title={''} />
            <EventHeader
              title={event.title}
              imageSrc={event.eventLogoUrl ?? '/images/virtual_event.webp'}
            />
            <EventUpdates eventId={eventId} currentUserId={userId} role={role} />
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
