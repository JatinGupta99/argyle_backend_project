'use client';

import { ROLES_ADMIN } from '@/app/auth/roles';
import { EventContextProvider } from '@/components/providers/EventContextProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { } from '@/lib/constants/api';
import { ChatCategoryType } from '@/lib/constants/chat';
import { ChatTab, } from '@/lib/slices/uiSlice';
import { getChatSessionStatus } from '@/lib/utils/chat-utils';
import { useAuth } from '@/app/auth/auth-context';
import SponsorList from './SponsorList';

interface SponsorListWrapperProps {
  event: any; // Ideally typed Event
}

export default function SponsorListWrapper({ event }: SponsorListWrapperProps) {
  const { userId } = useAuth();
  if (!event?._id) return <div className="text-red-500">Invalid Event</div>;

  return (
    <ReduxProvider>
      <EventContextProvider event={event}>
        <SidebarProvider>
          <SplitLayout
            sidebar={
              <ChatPanel
                title3={ChatTab.Chat}
                role={ROLES_ADMIN.Attendee}
                eventId={event._id}
                currentUserId={userId ||
                  ""
                }
                type={getChatSessionStatus(event)}
                tabs={[ChatCategoryType.CHAT, ChatCategoryType.QA]}
              />
            }
          >
            <Header title={event.title} />
            <div className="flex-1 overflow-auto">
              <SponsorList event={event} />
            </div>
          </SplitLayout>
        </SidebarProvider>
      </EventContextProvider>
    </ReduxProvider>
  );
}
