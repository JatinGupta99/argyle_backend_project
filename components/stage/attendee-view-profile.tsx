'use client';

import { Header } from '@/components/stage/layout/Header';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { AppSidebar } from '@/components/stage/appSidebar';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { SidebarProvider } from '@/components/ui/Sidebar';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import DailyVideoGrid from '@/components/stage/video/DailyVideoGrid';

export default function AttendeeViewProfilePage() {
  const isLive = useSelector((state: RootState) => state.ui.isLive);
  const roomUrl = useSelector((state: RootState) => state.ui.roomUrl);

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <div className="w-[12.5%] min-w-[12.5%] border-r">
              <AppSidebar />
            </div>
            <div className="w-[12.5%] min-w-[12.5%] border-r h-full">
              <ChatPanel role="attendee" title1="Everyone" title2="BackStage" />
            </div>
            <div className="flex-1 bg-white h-full overflow-hidden">
              {isLive && roomUrl ? (
                <DailyVideoGrid roomUrl={roomUrl} />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p>Event is not live yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
