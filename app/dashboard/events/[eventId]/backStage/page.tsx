'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { BackstageContent } from '@/components/stage/backstage/BackstageContent';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

export default function BackstagePage() {
  const event = useEventContext();
  const userId = UserID;
  const eventID = event._id;
  const eventStartTime = event.schedule.startTime as Date;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
          <aside className="w-[27%] flex-shrink-0 bg-[#111] flex flex-col border-r border-gray-800">
            <ChatPanel
              title3={ChatTab.Everyone}
              role={RoleView.Speaker}
              eventId={eventID}
              currentUserId={userId}
              type={ChatSessionType.PRE_LIVE}
              tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
            />
          </aside>
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header title={event.title} />
            <BackstageContent targetDate={eventStartTime} />
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
