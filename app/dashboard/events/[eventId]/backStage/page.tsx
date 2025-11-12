import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { BackstageContent } from '@/components/stage/backstage/BackstageContent';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

const targetDate = new Date('2025-11-12T15:00:00Z');

export default function BackstagePage() {
  const eventId = EventId;
  const userId = UserID;
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
            <ChatPanel
              title3={ChatTab.Everyone}
              role={RoleView.Speaker}
              eventId={eventId}
              currentUserId={userId}
              type={ChatSessionType.PRE_LIVE}
              tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
            />
          </aside>

          <div className="flex flex-col flex-1 overflow-hidden bg-white">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <BackstageContent targetDate={targetDate} />
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
