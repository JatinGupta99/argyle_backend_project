'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import { getDetailedSponsors } from '@/lib/sponsor';

export default function SponsorBoothBillPage() {
  const params = useParams();
  const router = useRouter();
  const { eventId, sponsorId } = params as { eventId: string; sponsorId: string };

  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sponsor details
  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        if (!eventId || !sponsorId) return;
        const response = await getDetailedSponsors(eventId, sponsorId);

        if (!response) throw new Error('Sponsor not found');
        setSponsor(response);
      } catch (err: any) {
        console.error('Failed to fetch sponsor:', err);
        setError(err.message || 'Failed to fetch sponsor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, [eventId, sponsorId]);

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading sponsor details...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // No sponsor found
  if (!sponsor) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        No sponsor data found.
      </div>
    );
  }

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* Chat Sidebar */}
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col">
            <ChatPanel
              title3={ChatTab.Chat}
              role={RoleView.Attendee}
              eventId={EventId}
              currentUserId={UserID}
              type={ChatSessionType.LIVE}
              tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
            />
          </aside>

          {/* Main Sponsor Booth */}
          <main className="flex flex-1 flex-col overflow-hidden bg-white">
            <Header title={sponsor?.name || 'Sponsor Details'} />
            <div className="flex-1 overflow-auto">
              <SponsorDetails sponsor={sponsor} eventId={eventId} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
