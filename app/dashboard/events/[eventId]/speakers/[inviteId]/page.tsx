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
import { determineRoleWithFallback, extractNameFromToken } from '@/lib/utils/jwt-utils';

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

import { useAuth } from '@/app/auth/auth-context';
import { PageGuard } from '@/components/auth/PageGuard';
import { Loader2, ShieldAlert } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

import { CountdownDisplay } from '@/components/shared/CountdownDisplay';

export default function SpeakerPage() {
  const { inviteId } = useParams<{ inviteId: string }>();
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');
  const event = useEventContext();
  const { setAuth, token: authToken } = useAuth(); // Use authToken from context (localStorage)

  const [token, setToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [localRole, setLocalRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... time logic ...
  const targetDate = useMemo(() => {
    const start = event?.schedule?.startTime;
    if (!start) return new Date();
    return start instanceof Date ? start : new Date(start);
  }, [event?.schedule?.startTime]);

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

  /* -------------------------- Token Fetching ------------------------------ */

  useEffect(() => {
    if (!inviteId) return;

    const fetchToken = async () => {
      try {
        setIsLoading(true);

        // 1. Try to use existing Auth Token (from localStorage via AuthContext) if valid
        // This avoids re-fetching or issues if URL token is gone on refresh.
        // However, we still need the Room URL and Daily Token which might be different?
        // Usually, the invite token IS the daily token or related.

        // Let's first fetch the specific join data needed for the stage
        const res = await axios.get<{ data: DailyJoinResponse }>(
          `${process.env.NEXT_PUBLIC_API_URL}/invite/join/${inviteId}`,
        );
        const { token: dailyToken, roomUrl: url } = res.data.data;

        // 2. Determine Role & Name
        // Priority: URL -> Context/Storage -> Daily Token
        const tokenToAnalyze = urlToken || authToken || dailyToken;

        const extractedRole = determineRoleWithFallback(tokenToAnalyze, dailyToken);
        const extractedName = extractNameFromToken(tokenToAnalyze);

        setToken(dailyToken);
        setRoomUrl(url);
        setLocalRole(extractedRole);
        setUserName(extractedName);

        // 3. Update Sync AuthContext
        // We use the most authoritative token we have for the app session
        // If we have a fresh daily token or url token, we update the app session.
        const appToken = urlToken || dailyToken;
        if (appToken && appToken !== authToken) {
          const userId = extractNameFromToken(appToken) || 'speaker'; // minimal id
          setAuth(extractedRole, userId, appToken);
        }

      } catch (err: any) {
        console.error('[SpeakerPage] Access verification failed:', err);
        setError('We could not verify your speaker credentials. Please check your invitation link.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [inviteId, urlToken, authToken, setAuth]);

  /* ----------------------------- Render Helpers --------------------------- */

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
          {/* Speakers can always join - backstage mode with countdown shown in header */}
          <div className="w-full h-full p-4">
            <SpeakerViewContent
              token={token}
              roomUrl={roomUrl}
              eventId={event!._id!}
              role={localRole}
              userName={userName || undefined}
              initialIsLive={eventIsLive}
              startTime={targetDate}
            />
          </div>
        </div>
      </EventStageLayout>
    </PageGuard>
  );
}
