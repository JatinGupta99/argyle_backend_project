'use client';

import { PageGuard } from '@/components/auth/PageGuard';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { SpeakerViewContent } from '@/components/speaker/SpeakerViewContent';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-context';
import { extractRoleFromInviteToken, extractNameFromToken } from '@/lib/utils/jwt-utils';

export default function ModeratorPage() {
  const event = useEventContext();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  const { setAuth, token: authToken } = useAuth(); // Use authToken from context

  // Handle initial token auth sync
  useEffect(() => {
    if (urlToken && urlToken !== authToken) {
      const role = extractRoleFromInviteToken(urlToken);
      const name = extractNameFromToken(urlToken) || ROLES_ADMIN.Moderator;
      // Only set auth if it's actually a moderator token, to be safe? 
      // The PageGuard will catch it anyway.
      setAuth(role, name, urlToken);
    }
  }, [urlToken, authToken, setAuth]);

  const targetDate = useMemo(() => {
    const start = event?.schedule?.startTime;
    if (!start) return new Date();
    return start instanceof Date ? start : new Date(start);
  }, [event?.schedule?.startTime]);

  const [eventIsLive, setEventIsLive] = useState<boolean>(
    new Date() >= targetDate
  );

  // Sync live state (for pre-live chat type switching)
  useEffect(() => {
    if (eventIsLive) return;
    const interval = setInterval(() => {
      if (new Date() >= targetDate) {
        setEventIsLive(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, eventIsLive]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Loading event context...</p>
      </div>
    );
  }

  return (
    <PageGuard permission="event:manage" role={ROLES_ADMIN.Moderator}>
      <EventStageLayout
        chatType={eventIsLive ? ChatSessionType.LIVE : ChatSessionType.PRE_LIVE}
        chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.QA, ChatCategoryType.BACKSTAGE]}
        title="Moderator Stage"
      >
        <div className="flex-1 -mt-4 h-full relative">
          <div className="w-full h-full p-4">
            <SpeakerViewContent
              eventId={event._id!}
              roomUrl={event.dailyRoomDetails?.dailyRoomUrl || ''}
              role={ROLES_ADMIN.Moderator}
              userName={ROLES_ADMIN.Moderator} // Or user.name from context
              token={urlToken || authToken}
              initialIsLive={eventIsLive}
              startTime={targetDate}
            />
          </div>
        </div>
      </EventStageLayout>
    </PageGuard>
  );
}
