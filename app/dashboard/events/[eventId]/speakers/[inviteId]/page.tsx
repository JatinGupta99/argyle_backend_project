'use client';

import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Role, ROLES } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { SpeakerViewContent } from '@/components/speaker/SpeakerViewContent';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice';
import { DailyJoinResponse } from '@/lib/types/daily';
import { determineRoleWithFallback } from '@/lib/utils/jwt-utils';

import { useAuth } from '@/app/auth/auth-context';
import { PageGuard } from '@/components/auth/PageGuard';
import { Loader2, ShieldAlert } from 'lucide-react';

import { CountdownDisplay } from '@/components/shared/CountdownDisplay';

export default function SpeakerPage() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  const event = useEventContext();
  const { setRole } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [localRole, setLocalRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetDate = useMemo(
    () => new Date(event?.schedule?.startTime ?? Date.now()),
    [event?.schedule?.startTime]
  );

  const [eventIsLive, setEventIsLive] = useState<boolean>(
    new Date() >= targetDate
  );

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

  useEffect(() => {
    if (!inviteId) return;

    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<{ data: DailyJoinResponse }>(
          `${process.env.NEXT_PUBLIC_API_URL}/invite/join/${inviteId}`,
        );
        const { token: dailyToken, roomUrl: url } = res.data.data;

        const extractedRole = determineRoleWithFallback(urlToken, dailyToken);

        setToken(dailyToken);
        setRoomUrl(url);
        setLocalRole(extractedRole);
        setRole(extractedRole, 'speaker-session');

      } catch (err: any) {
        console.error('[SpeakerPage] Access verification failed:', err);
        setError('We could not verify your speaker credentials. Please check your invitation link.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [inviteId, urlToken, setRole]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Error</h1>
        <p className="text-slate-600 max-w-md mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading || !token || !roomUrl || !localRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium tracking-tight">Verifying speaker credentials...</p>
      </div>
    );
  }

  return (
    <PageGuard role={[ROLES.SPEAKER, ROLES.MODERATOR]}>
      <EventStageLayout
        role={RoleView.Speaker}
        chatType={eventIsLive ? ChatSessionType.LIVE : ChatSessionType.PRE_LIVE}
        chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
        title="Speaker Live Stage"
      >
        <div className="flex-1 -mt-4 h-full relative">
          {!eventIsLive ? (
            <div className="absolute inset-0 bg-black">
              <CountdownDisplay
                startTime={targetDate}
                eventTitle={event.title || 'Live Stage'}
                logoUrl={event.eventLogoUrl}
                onTimerComplete={() => setEventIsLive(true)}
              />
            </div>
          ) : (
            <div className="w-full h-full p-6">
              <SpeakerViewContent
                token={token}
                roomUrl={roomUrl}
                eventId={event!._id!}
                role={localRole}
              />
            </div>
          )}
        </div>
      </EventStageLayout>
    </PageGuard>
  );
}
