'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SponsorCard } from '@/components/stage/sponsor-card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
import { RoleView } from '@/lib/slices/uiSlice.ts';

export default function Page() {
  const sponsors = [
    { imageSrc: '/sponsors/bill-logo.jpg', name: 'bill' },
    { imageSrc: '/sponsors/argyle-logo.png', name: 'argyle' },
    { imageSrc: '/sponsors/ibm-logo.png', name: 'IBM' },
    { imageSrc: '/sponsors/Oracle-logo.png', name: 'Oracle' },
  ];

  const chatRole: RoleView = 'speaker';

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Chat Panel */}
      <div className="w-[310px] border-r border-gray-200">
        <ChatPanel
          title1="Chat"
          title2="Q&A"
          title3="Chat"
          role={chatRole}
          eventId={EventId}
          currentUserId={UserID}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-[2]">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />

            <h1 className="font-bold text-center mt-9">
              VISIT OUR SPONSORS BOOTHS:
            </h1>

            <div className="grid grid-cols-2 gap-5 p-3">
              {sponsors.map((s, i) => (
                <SponsorCard key={i} imageSrc={s.imageSrc} name={s.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
