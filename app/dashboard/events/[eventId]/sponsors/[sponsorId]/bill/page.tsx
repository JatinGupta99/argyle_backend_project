'use client';

import { useParams } from 'next/navigation';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { useDetailedSponsor } from '@/hooks/useDetailedSponsor';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

export default function SponsorBoothBillPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const sponsorId = params?.sponsorId as string;

  if (!eventId || !sponsorId) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Invalid URL parameters.
      </div>
    );
  }

  const { sponsor, loading, error } = useDetailedSponsor(eventId, sponsorId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading…</div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="flex h-screen items-center justify-center">
        No sponsor data found.
      </div>
    );
  }

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] bg-[#FAFAFA] border-r">
            <ChatPanel
              youtubeUrl={sponsor.youtubeUrl}
              title3={ChatTab.Chat}
              eventId={eventId}
              currentUserId={UserID}
              role={RoleView.Attendee}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
            />
          </aside>

          <main className="flex flex-col flex-1 overflow-hidden bg-white">
            <Header title={sponsor.name ?? 'Sponsor'} />
            <div className="flex-1 overflow-auto">
              <SponsorDetails sponsor={sponsor} eventId={eventId} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
