'use client';

import { AuthProvider, useAuth } from '@/app/auth/auth-context';
import { Role, ROLES } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { useSearchParams } from 'next/navigation';
import { extractRoleFromInviteToken } from '@/lib/utils/jwt-utils';
import { EventHeader } from '@/components/stage/event-headers';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import { getEventDownloadUrl } from '@/lib/event';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

function EventPageContent() {
  const event = useEventContext();
  const { role, userId, setRole } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);

  const eventId = event._id as string;
  const currentUserId = userId || UserID;

  useEffect(() => {
    if (role) return;

    // Use centralized utility to extract role from token
    const determinedRole = token ? extractRoleFromInviteToken(token) : ROLES.ATTENDEE;

    setRole(determinedRole, UserID);
  }, [token, role, setRole]);

  useEffect(() => {
    async function fetchImage() {
      if (eventId) {
        try {
          const url = await getEventDownloadUrl(eventId);
          if (url) setImageSignedUrl(url);
        } catch (err) {
          console.error('Failed to fetch event image:', err);
        }
      }
    }
    fetchImage();
  }, [eventId]);

  if (!role) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">


      <aside className="w-[310px] border-r border-gray-200 bg-white flex-shrink-0">
        <ChatPanel
          title3={ChatTab.Argyle}
          role={role === ROLES.MODERATOR ? RoleView.Moderator : RoleView.Attendee}
          eventId={eventId}
          currentUserId={currentUserId}
          type={ChatSessionType.PRE_LIVE}
          tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
        />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title={event.title || ''} />
        <div className="flex-1 overflow-y-auto">
          <EventHeader
            title={event.title || ''}
            imageSrc={imageSignedUrl || event.eventLogoUrl || '/images/virtual_event.webp'}
          />
          <EventUpdates
            eventId={eventId}
            currentUserId={currentUserId}
          />
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return <EventPageContent />;
}
