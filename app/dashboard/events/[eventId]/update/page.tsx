'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatType } from '@/lib/constants/chat';
export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
          <div className="w-[310px] border-r border-gray-200">
            <ChatPanel
              title1="Everyone"
              title2=""
              title3="Chat with Argyle here"
              role={'attendee'}
              eventId={EventId}
              currentUserId={UserID}
              type={ChatType.PRE_LIVE}
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
