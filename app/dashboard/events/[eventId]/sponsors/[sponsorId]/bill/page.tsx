'use client';

import { ROLES_ADMIN } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useDetailSponsor } from '@/hooks/useDetailSponsor';
import { } from '@/lib/constants/api';
import { ChatCategoryType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice';
import { getChatSessionStatus } from '@/lib/utils/chat-utils';
import { useAuth } from '@/app/auth/auth-context';
import { useParams } from 'next/navigation';

export default function SponsorBillPage() {
  const params = useParams();
  const sponsorId = params.sponsorId as string;
  const event = useEventContext();
  const { userId } = useAuth();
  const { sponsor, loading, error } = useDetailSponsor(event?._id || '', sponsorId);
  if (loading) return <div className="flex h-screen items-center justify-center">Loading sponsor…</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!sponsor) return <div className="flex h-screen items-center justify-center">No sponsor data found.</div>;
  console.log(sponsor, 'saclbacslknascl')
  return (
    <SidebarProvider>
      <SplitLayout
        sidebar={
          <ChatPanel
            youtubeUrl={sponsor.youtubeUrl}
            title3={ChatTab.Chat}
            eventId={event?._id || ''}
            currentUserId={userId ||
              ""
            }
            role={ROLES_ADMIN.Attendee}
            type={getChatSessionStatus(event || {})}
            tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
          />
        }
      >
        <Header title={sponsor.name ?? 'Sponsor'} />
        <div className="flex-1 overflow-auto">
          <SponsorDetails sponsor={sponsor} eventId={event?._id || ''} />
        </div>
      </SplitLayout>
    </SidebarProvider>
  );
}
