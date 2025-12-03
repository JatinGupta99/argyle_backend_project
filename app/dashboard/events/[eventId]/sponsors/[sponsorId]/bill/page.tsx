'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useDetailedSponsor } from '@/hooks/useDetailedSponsor';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import { useParams } from 'next/navigation';

export default function SponsorBoothBillPage() {
  const params=useParams();
  const sponsorId=params.sponsorId as string;
  const event = useEventContext();
  const { sponsor, loading, error } = useDetailedSponsor(event._id, sponsorId);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading sponsor…</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!sponsor) return <div className="flex h-screen items-center justify-center">No sponsor data found.</div>;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <aside className="w-[27%] bg-[#FAFAFA] border-r">
          <ChatPanel
            youtubeUrl={sponsor.youtubeUrl}
            title3={ChatTab.Chat}
            eventId={event._id}
            currentUserId={UserID}
            role={RoleView.Attendee}
            type={ChatSessionType.LIVE}
            tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
          />
        </aside>

        <main className="flex flex-col flex-1 overflow-hidden bg-white">
          <Header title={sponsor.name ?? 'Sponsor'} />
          <div className="flex-1 overflow-auto">
            <SponsorDetails sponsor={sponsor} eventId={event._id} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
