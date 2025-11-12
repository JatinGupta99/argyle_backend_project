'use client';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

export default function SponsorBoothBillPage() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col">
            <ChatPanel
              title1={ChatTab.Chat}
              title2={ChatTab.QA}
              title3={ChatTab.Chat}
              role={RoleView.Attendee}
              eventId={EventId}
              currentUserId={UserID}
              type={ChatType.LIVE}
            />
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden bg-white">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <div className="flex-1 overflow-auto">
              <SponsorDetails />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
