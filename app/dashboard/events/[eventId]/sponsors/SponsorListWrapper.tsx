'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import SponsorList from './SponsorList';

export default function SponsorListWrapper({ eventId }: { eventId: string }) {
  if (!eventId) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Invalid event ID
      </div>
    );
  }

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* LEFT CHAT PANEL */}
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] border-r">
            <ChatPanel
              title3={ChatTab.Chat}
              role={RoleView.Attendee}
              eventId={eventId}
              currentUserId={UserID}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
            />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex flex-col flex-1 overflow-hidden bg-white">
            <Header title="Sponsors" />

            <div className="flex-1 overflow-auto">
              <SponsorList eventId={eventId} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
