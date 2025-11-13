'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SpeakerStage } from '@/components/stage/views/SpeakerStage';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

export default function SpeakerPage() {
  const event = useEventContext();
  const userId = UserID;
  const eventId = event._id;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-white">
          
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

    
          <div className="flex flex-col flex-1 h-full overflow-hidden">
  
            <Header title={event.title} />


            <div className="flex-1 overflow-hidden -mt-4">
              <SpeakerStage eventId={eventId} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
