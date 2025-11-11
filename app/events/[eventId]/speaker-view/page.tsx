'use client';

import { Header } from '@/components/layout/Header/Page';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { VideoPanel } from '@/components/stage/VideoPanel';
import { Sidebar, SidebarProvider } from '@/components/ui/Sidebar';
import { ChatType } from '@/lib/constants/chat';

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
                title2="BackStage"
                title3="Everyone"
                 type={ChatType.LIVE}
              />
            </div>
            <div className="flex-[2] ">
              <Header />
              <div className="relative flex-none w-[700px] aspect-[4/3] bg-gray-900 ml-10">
                <VideoPanel eventId="" role="speaker" />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
