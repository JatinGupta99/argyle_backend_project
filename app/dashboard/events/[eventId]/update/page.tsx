import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import { EventPageProps } from '@/lib/types/components';
export default async function Page({
  params,
}: EventPageProps) {
  const { eventId } = await params;
  const userId = UserID;
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
          <div className="w-[310px] border-r border-gray-200">
            <ChatPanel
              title3={ChatTab.Argyle}
              role={RoleView.Attendee}
              eventId={eventId}
              currentUserId={userId}
              type={ChatSessionType.PRE_LIVE}
              tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
            />
          </div>
          <section className="flex-1 flex flex-col">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <div className="flex-1 overflow-hidden">
              <EventUpdates />
            </div>
          </section>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
