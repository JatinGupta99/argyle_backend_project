'use client';

import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';
import { Sponsor } from '@/lib/sponsor';

export default function SponsorBooth({
  eventId,
  sponsor,
}: {
  eventId: string;
  sponsor: Sponsor;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <aside className="w-[27%] bg-[#FAFAFA] border-r">
        <ChatPanel
          title3={ChatTab.Chat}
          role={RoleView.Attendee}
          eventId={eventId}
          currentUserId={UserID}
          type={ChatSessionType.LIVE}
          tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
        />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <Header title={sponsor.name} />
        <div className="flex-1 overflow-auto">
          <SponsorDetails sponsor={sponsor} eventId={eventId} />
        </div>
      </main>
    </div>
  );
}
