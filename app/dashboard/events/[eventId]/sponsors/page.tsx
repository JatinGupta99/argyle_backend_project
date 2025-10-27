'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SponsorCard } from '@/components/stage/sponsor-card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';

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
            
            <div className="flex-[2] ">
              <div>
                     
              <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
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
