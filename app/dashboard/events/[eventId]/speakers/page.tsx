'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SpeakerStage } from '@/components/stage/views/SpeakerStage';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

interface SpeakerPageProps {
  params: { eventId: string };
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  // const { eventId } = params;
  const userId = UserID;
  const eventId = EventId;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
            <ChatPanel
              title3={ChatTab.Argyle}
              role={RoleView.Speaker}
              eventId={eventId}
              currentUserId={userId}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
            />
          </aside>

          <div className="flex-1 flex flex-col">
            <Header title="" />
            <div className="flex-1">
              <SpeakerStage eventId={EventId} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
