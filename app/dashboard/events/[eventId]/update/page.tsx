'use client';

import { AuthProvider, useAuth } from '@/app/auth/auth-context';
import { ROLES } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { EventHeader } from '@/components/stage/event-headers';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import { ROLEBASED } from '@/lib/types/daily';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

function EventPageContent() {
  const event = useEventContext();
  const { role, userId, setRole } = useAuth();

  const eventId = event._id as string;
  const currentUserId = userId || UserID;

  useEffect(() => {
    if (!role) {
      setRole(ROLES.MODERATOR, UserID);
    }
  }, [role, setRole]);

  if (!role) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden relative">
      <div className="absolute top-2 right-4 z-50 flex gap-2 bg-white/80 p-1 rounded-md border shadow-sm">
        <button
          onClick={() => setRole(ROLES.ATTENDEE, UserID)}
          className={`px-3 py-1 text-xs rounded ${role === ROLES.ATTENDEE ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        >
          Attendee View
        </button>
        <button
          onClick={() => setRole(ROLES.MODERATOR, UserID)}
          className={`px-3 py-1 text-xs rounded ${role === ROLES.MODERATOR ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
        >
          Moderator View
        </button>
      </div>

      <aside className="w-[310px] border-r border-gray-200 bg-white">
        <ChatPanel
          title3={ChatTab.Argyle}
          role={role === ROLES.MODERATOR ? RoleView.Moderator : RoleView.Attendee}
          eventId={eventId}
          currentUserId={currentUserId}
          type={ChatSessionType.PRE_LIVE}
          tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
        />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={event.title || ''} />
        <EventHeader
          title={event.title || ''}
          imageSrc={event.eventLogoUrl ?? '/images/virtual_event.webp'}
        />
        <EventUpdates
          eventId={eventId}
          currentUserId={currentUserId}
          role={role === ROLES.MODERATOR ? ROLEBASED.MODERATOR : ROLEBASED.ATTENDEE}
        />
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <EventPageContent />
    </AuthProvider>
  );
}
