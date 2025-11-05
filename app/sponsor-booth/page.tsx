'use client';

import { Header } from '@/components/layout/Header/Page';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/AppSideBar';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { SponsorCard } from '@/components/stage/SponsorCard';
import { Sidebar, SidebarProvider } from '@/components/ui/Sidebar';

export default function Page() {
  const sponsors = [
    { imageSrc: '/sponsors/bill-logo.jpg', name: 'bill' },
    { imageSrc: '/sponsors/argyle-logo.png', name: 'argyle' },
    { imageSrc: '/sponsors/ibm-logo.png', name: 'IBM' },
    { imageSrc: '/sponsors/Oracle-logo.png', name: 'Oracle' },
  ];

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
            <div className="w-[21.75%] h-full p-0 m-0">
              <ChatPanel
                role="speaker"
                title1="Chat"
                title2="Q&A"
                title3="Chat"
              />
            </div>
            <div className="flex-[2] ">
              <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
              <div>
                <h1 className="font-bold text-center mt-9">
                  VISIT OUR SPONSORS BOOTHS:
                </h1>

                <div className="grid grid-cols-2 gap-6">
                  {sponsors.map((s, i) => (
                    <SponsorCard key={i} imageSrc={s.imageSrc} name={s.name} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
