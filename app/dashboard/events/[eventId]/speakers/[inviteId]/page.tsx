'use client';

import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Role, ROLES_ADMIN } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { SpeakerViewContent } from '@/components/speaker/SpeakerViewContent';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice';
import { DailyJoinResponse } from '@/lib/types/daily';
import { determineRoleWithFallback, extractNameFromToken, extractUserDataFromToken } from '@/lib/utils/jwt-utils';

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

        // 1. Decode Role from JWT (Look at who is trying to join)
        const tokenToAnalyze = urlToken || authToken;
        const details = tokenToAnalyze ? extractUserDataFromToken(tokenToAnalyze) : null;

        if (details) {
          console.log(`[SpeakerPage] Verifying role: ${details.role} for user: ${details.name}`);
        }

        // 2. Call backend to verify invite and GENERATE the Daily Meeting Token
        // We pass the JWT in the header for secure verification
        const res = await axios.get<{ data: DailyJoinResponse }>(
          `${process.env.NEXT_PUBLIC_API_URL}/invite/join/${inviteId}`,
          {
            headers: tokenToAnalyze ? { Authorization: `Bearer ${tokenToAnalyze}` } : {}
          }
        );

        const { token: generatedDailyToken, roomUrl: apiRoomUrl } = res.data.data;

        // 3. Consolidate Join Parameters
        // Priority: Room URL from JWT -> Room URL from API
        const finalRoomUrl = details?.dailyUrl || apiRoomUrl;
        const extractedRole = details?.role || ROLES_ADMIN.Speaker;
        const extractedName = details?.name || 'Speaker';

        console.log('[SpeakerPage] Verification complete. Joining stage...');

        setToken(generatedDailyToken);
        setRoomUrl(finalRoomUrl);
        setLocalRole(extractedRole);
        setUserName(extractedName);

        // 4. Sync Auth Context if needed
        if (tokenToAnalyze && tokenToAnalyze !== authToken) {
          setAuth(extractedRole, extractedName, tokenToAnalyze);
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
    <PageGuard role={[ROLES_ADMIN.Speaker, ROLES_ADMIN.Moderator]}>
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
              token={urlToken || token}
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
