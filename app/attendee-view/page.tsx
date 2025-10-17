'use client';

import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/app-sidebar';
import { ChatPanel } from '@/components/stage/left-panel';
import { VideoPanel } from '@/components/stage/video-panel';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar/>
        {/* Chat panel */}
        <ChatPanel />

        {/* Video panel */}
        <div className="flex-1 overflow-hidden">
          <VideoPanel eventId="" />
        </div>
      </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
