'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SpeakerStage } from '@/components/stage/views/SpeakerStage';
import { SidebarProvider } from '@/components/ui/sidebar';
import { chatTitles, EventId, UserID } from '@/lib/constants/api';
import { ChatType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice.ts';

interface SpeakerPageProps {
  params: { eventId: string };
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  // const { eventId } = params;
  const userId=UserID;
  const eventId=EventId;

    return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
            <ChatPanel
              title1={chatTitles.Everyone}
              title2={chatTitles.Backstage}
              title3="Chat with Argyle here"
              role={RoleView.Speaker}
              eventId={eventId}
              currentUserId={userId}
              type={ChatType.LIVE}
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
