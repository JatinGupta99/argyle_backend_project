'use client';

import { AuthProvider, useAuth } from '@/app/auth/auth-context';
import { Role, ROLES_ADMIN } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { useSearchParams } from 'next/navigation';
import { extractRoleFromInviteToken } from '@/lib/utils/jwt-utils';
import { EventHeader } from '@/components/stage/event-headers';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import { getEventDownloadUrl } from '@/lib/event';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

function EventPageContent() {
  const event = useEventContext();
  const { role, userId, token: authToken, setAuth } = useAuth();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');

  const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const eventId = event._id as string;
  const currentUserId = userId || UserID;

  console.log('[Update Page] Event Context:', {
    eventId,
    eventTitle: event.title,
    fullEvent: event
  });

  const maxWidthClass = isSidebarCollapsed ? 'max-w-[75rem]' : 'max-w-[60rem]';
  const inputMaxWidthClass = isSidebarCollapsed ? 'max-w-[65rem]' : 'max-w-[50rem]';

  useEffect(() => {
    if (role) return;

    const tokenToUse = urlToken || authToken;
    const determinedRole = tokenToUse ? extractRoleFromInviteToken(tokenToUse) : ROLES_ADMIN.Attendee;

    setAuth(determinedRole, UserID, tokenToUse || '');
  }, [urlToken, authToken, role, setAuth]);

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
    <SplitLayout
      sidebar={
        <ChatPanel
          title3={ChatTab.Argyle}
          role={role === ROLES_ADMIN.Moderator ? ROLES_ADMIN.Moderator : ROLES_ADMIN.Attendee}
          eventId={eventId}
          currentUserId={currentUserId}
          type={ChatSessionType.PRE_LIVE}
          tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
        />
      }
    >
      <Header title={event.title || ''} />
      <div className="flex-1 overflow-y-auto">
        <EventHeader
          title={event.title || ''}
          imageSrc={imageSignedUrl || event.eventLogoUrl || '/images/virtual_event.webp'}
          maxWidthClass={maxWidthClass}
        />
        <EventUpdates
          eventId={eventId}
          currentUserId={currentUserId}
          maxWidthClass={maxWidthClass}
          inputMaxWidthClass={inputMaxWidthClass}
        />
      </div>
    </SplitLayout>
  );
}

export default function Page() {
  return <EventPageContent />;
}
