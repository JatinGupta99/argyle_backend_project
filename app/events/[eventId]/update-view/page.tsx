'use client';

import { ReduxProvider } from '@/components/providers/redux-provider';
import { SidebarProvider, Sidebar } from '@/components/ui/Sidebar';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { EventUpdates } from '@/components/stage/event-updates';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { ChatType } from '@/lib/constants/chat';

export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
          <Sidebar
            variant="sidebar"
            collapsible="none"
            className="bg-[#F9F9F9] border-r"
          >
            <AppSidebar />
          </Sidebar>

          <main className="flex flex-1 overflow-hidden">
            <aside className="w-[22%] min-w-[280px] border-l bg-white">
              <ChatPanel role='attendee'        type={ChatType.LIVE} title1='EveryOne' title2='EveryOne' title3='Chat with Argyle here' currentUserId="68e630972af1374ec4c36630" />
            </aside>
            <section className="flex-1 overflow-y-auto">
              <EventUpdates />
            </section>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
