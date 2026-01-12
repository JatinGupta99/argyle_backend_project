'use client';

import { EventContextProvider } from '@/components/providers/EventContextProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import SponsorList from './SponsorList';

interface SponsorListWrapperProps {
  event: any; // Ideally typed Event
}

export default function SponsorListWrapper({ event }: SponsorListWrapperProps) {
  if (!event?._id) return <div className="text-red-500">Invalid Event</div>;

  return (
    <ReduxProvider>
      <EventContextProvider event={event}>
        <SidebarProvider>
          <SplitLayout
            sidebar={
              <ChatPanel
                title3={ChatTab.Chat}
                role={RoleView.Attendee}
                eventId={event._id}
                currentUserId={UserID}
                type={ChatSessionType.LIVE}
                tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
              />
            }
          >
            <Header title="Sponsors" />
            <div className="flex-1 overflow-auto">
              <SponsorList event={event} />
            </div>
          </SplitLayout>
        </SidebarProvider>
      </EventContextProvider>
    </ReduxProvider>
  );
}
