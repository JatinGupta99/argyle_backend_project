'use client';

import { Header } from '@/components/layout/Header/Page';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { CountdownTimer } from '@/components/stage/backStage/CountDownTimer';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Sidebar, SidebarProvider } from '@/components/ui/Sidebar';

export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              variant="sidebar"
              collapsible="none"
              className=" bg-[#F9F9F9]"
            >
              <AppSidebar />
            </Sidebar>
            <div className="w-[21.75%] h-full p-0 m-0 bg-red-500">
              <ChatPanel
                role="speaker"
                title1="Everyone"
                title2="Backstage"
                title3="Backstage"
              />
            </div>
            <div className="flex-[2] bg-black ">
              <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
              <CountdownTimer targetDate={new Date('2025-10-21T15:00:00Z')} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
