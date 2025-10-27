'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
           <div className='flex-[2]'>
        <ChatPanel
        title1=''
        title2=''
        title3='Chat with Argyle here'
        role={'attendee'}
        eventId={EventId}
        currentUserId={UserID}
        />
      </div>
          <section className="flex-1 flex flex-col">
           <Header
    title="Financial Controller Leadership Forum: Redefining Trad..."
  />
            <div className="flex-1 overflow-hidden">
              <EventUpdates />
            </div>
          </section>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
