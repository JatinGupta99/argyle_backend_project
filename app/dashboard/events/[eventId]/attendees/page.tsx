'use client';

import { useAuth } from '@/app/auth/auth-context';
import { DailyRoomAttendee } from '@/components/daily/DailyRoomAttendee';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { CountdownDisplay } from '@/components/shared/CountdownDisplay';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ROLES_ADMIN } from '@/app/auth/roles';
import { PageGuard } from '@/components/auth/PageGuard';
import type { Event as IEvent } from '@/lib/types/components';
import { getEventTimingStatus } from '@/lib/utils/event-timing';
import { extractNameFromToken, extractRoleFromInviteToken } from '@/lib/utils/jwt-utils';



export default function AttendeeViewProfilePage() {
  const event = useEventContext();
  const { schedule, dailyRoomDetails } = event;
  const { setAuth, token: authToken } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlToken = searchParams.get('token');


  const timing = getEventTimingStatus(event as IEvent);
  const targetDate = timing.startDate || new Date();

  const [isTimeReached, setIsTimeReached] = useState<boolean>(!!timing.isPastStart);
  const [isPastEnd, setIsPastEnd] = useState<boolean>(!!timing.isPastEnd);
  const [isExpired, setIsExpired] = useState<boolean>(!!timing.isExpired);



  useEffect(() => {
    // Sync URL token or existing token to AuthContext to ensure Socket connects.
    // For attendees, role is almost always Attendee, but token might carry info.
    const tokenToUse = urlToken || authToken;

    if (tokenToUse) {
      const determinedRole = extractRoleFromInviteToken(tokenToUse);
      // Fallback to Attendee if token doesn't specify (or if it's just a raw id token)
      const finalRole = determinedRole || ROLES_ADMIN.Attendee;
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
    const interval = setInterval(() => {
      const t = getEventTimingStatus(event as IEvent);
      setIsTimeReached(!!t.isPastStart);
      setIsPastEnd(!!t.isPastEnd);
      setIsExpired(!!t.isExpired);
    }, 5000);

    return () => clearInterval(interval);
  }, [event]);

  const isLiveOnBackend = event.status === 'LIVE';
  // Allow event to continue if it's LIVE, even if time is past end/expired.
  const isCompleted = event.status === 'COMPLETED' || (event.status !== 'LIVE' && isExpired);



  const chatType = (isLiveOnBackend || isTimeReached)
    ? ChatSessionType.LIVE
    : ChatSessionType.PRE_LIVE;

  return (
    <div className="h-full w-full">
      <PageGuard role={ROLES_ADMIN.Attendee}>
        <EventStageLayout
          role={ROLES_ADMIN.Attendee}
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
                <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
                  Thank you for joining us! This session has officially ended. Replays will be available in the dashboard soon.
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.history.length > 1) {
                      router.push(`/dashboard/events/${event._id}/info`);
                    } else {
                      window.close();
                    }
                  }}
                  className="px-8 py-3 bg-slate-800 border border-white/10 rounded-xl font-bold hover:bg-slate-700 transition-all text-slate-200"
                >
                  Leave Event
                </button>
              </div>

            ) : !isTimeReached ? (
              <div className="absolute inset-0 bg-black">
                <CountdownDisplay
                  startTime={targetDate}
                  eventTitle={event.title || 'Live Event'}
                  logoUrl={event.eventLogoUrl}
                  onTimerComplete={() => setIsTimeReached(true)}
                  onLeave={() => {
                    if (typeof window !== 'undefined' && window.history.length > 1) {
                      router.push(`/dashboard/events/${event._id}/info`);
                    } else {
                      window.close();
                    }
                  }}

                />
              </div>

            ) : (
              <div className="flex-1 flex h-full items-center justify-center p-4">
                <DailyRoomAttendee
                  role={ROLES_ADMIN.Attendee}
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
