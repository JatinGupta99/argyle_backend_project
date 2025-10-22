'use client';

import { Header } from '@/components/layout/Header/Page';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { EventUpdates } from '@/components/stage/event-updates';
import { VideoPanel } from '@/components/stage/VideoPanel';
import { Sidebar, SidebarProvider } from '@/components/ui/Sidebar';

export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
              variant="sidebar"
              collapsible="none"
              className="bg-[#F9F9F9]"
            >
              <AppSidebar />
            </Sidebar>

            {/* Chat panel */}
            <div className="w-[21.75%] h-full bg-red-500">
              <ChatPanel role="speaker" title3="Chat with Argyle here" />
            </div>

            {/* Main content area */}
            <div className="flex-[2]">

                <EventUpdates/>

            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
