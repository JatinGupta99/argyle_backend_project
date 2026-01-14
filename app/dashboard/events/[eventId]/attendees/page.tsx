'use client';

import { CountdownDisplay } from '@/components/shared/CountdownDisplay';
import { DailyRoomAttendee } from '@/components/daily/DailyRoomAttendee';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { useSearchParams } from 'next/navigation';
import { extractRoleFromInviteToken, extractNameFromToken } from '@/lib/utils/jwt-utils';
import { ROLES, ROLES_ADMIN } from '@/app/auth/roles';
import { PageGuard } from '@/components/auth/PageGuard';

export default function AttendeeViewProfilePage() {
  const event = useEventContext();
  const { schedule, dailyRoomDetails } = event;
  const { setAuth, token: authToken } = useAuth();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');

  const targetDate = schedule?.startTime instanceof Date
    ? schedule.startTime
    : new Date(schedule?.startTime || Date.now());

  const [isTimeReached, setIsTimeReached] = useState<boolean>(
    new Date() >= targetDate
  );

  useEffect(() => {
    // Sync URL token or existing token to AuthContext to ensure Socket connects.
    // For attendees, role is almost always Attendee, but token might carry info.
    const tokenToUse = urlToken || authToken;

    if (tokenToUse) {
      const determinedRole = extractRoleFromInviteToken(tokenToUse);
      // Fallback to Attendee if token doesn't specify (or if it's just a raw id token)
      const finalRole = determinedRole || ROLES.ATTENDEE;
      const userId = extractNameFromToken(tokenToUse) || 'attendee-guest';

      // Only update if we have a token (avoid clearing if just navigating)
      // But setAuth is safe.
      setAuth(finalRole, userId, tokenToUse);
    }
  }, [urlToken, authToken, setAuth]);

  // Placeholder for future status check logic
  useEffect(() => {
    // If we wanted to check status without reload, we could do a background fetch here
    if (event.status === 'LIVE' || event.status === 'COMPLETED') return;
  }, [event.status]);

  useEffect(() => {
    if (isTimeReached) return;

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= targetDate) {
        setIsTimeReached(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isTimeReached]);

  const isLiveOnBackend = event.status === 'LIVE';
  const isCompleted = event.status === 'COMPLETED';

  const chatType = isLiveOnBackend && isTimeReached
    ? ChatSessionType.LIVE
    : ChatSessionType.PRE_LIVE;

  return (
    <div className="h-full w-full">
      <PageGuard role={ROLES_ADMIN.Attendee}>
        <EventStageLayout
          role={RoleView.Attendee}
          chatType={chatType}
          chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
        >
          <div className="flex-1 h-full relative">
            {isCompleted ? (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Event Concluded</h2>
                <p className="text-slate-400 max-w-sm leading-relaxed">
                  Thank you for joining us! This session has officially ended. Replays will be available in the dashboard soon.
                </p>
              </div>
            ) : !isTimeReached ? (
              <div className="absolute inset-0 bg-black">
                <CountdownDisplay
                  startTime={targetDate}
                  eventTitle={event.title || 'Live Event'}
                  logoUrl={event.eventLogoUrl}
                  onTimerComplete={() => setIsTimeReached(true)}
                />
              </div>
            ) : (
              <div className="flex-1 flex h-full items-center justify-center p-4">
                <DailyRoomAttendee
                  role={RoleView.Attendee}
                  startTime={targetDate}
                  roomUrl={dailyRoomDetails?.dailyRoomUrl || ''}
                  eventIsLive={isTimeReached}
                  eventId={event._id || ''}
                />
              </div>
            )}
          </div>
        </EventStageLayout>
      </PageGuard>
    </div>
  );
}
