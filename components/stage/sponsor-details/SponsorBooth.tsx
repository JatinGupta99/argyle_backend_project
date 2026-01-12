'use client';

import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { EventId, UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import { Sponsor } from '@/lib/sponsor';

export default function SponsorBooth({
  eventId,
  sponsor,
}: {
  eventId: string;
  sponsor: Sponsor;
}) {
  return (
    <SplitLayout
      sidebar={
        <ChatPanel
          title3={ChatTab.Chat}
          role={RoleView.Attendee}
          eventId={eventId}
          currentUserId={UserID}
          type={ChatSessionType.LIVE}
          tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
        />
      }
    >
      <Header title={sponsor.name} />
      <div className="flex-1 overflow-auto">
        <SponsorDetails sponsor={sponsor} eventId={eventId} />
      </div>
    </SplitLayout>
  );
}
