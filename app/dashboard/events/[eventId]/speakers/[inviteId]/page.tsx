'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ROLES } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { SpeakerViewContent } from '@/components/speaker/SpeakerViewContent';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice';
import {
  DailyJoinResponse,
  DailyTokenPayload,
  ROLEBASED,
} from '@/lib/types/daily';

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function SpeakerPage() {
  /* ------------------------------- Params -------------------------------- */

  const { inviteId } = useParams<{ inviteId: string }>();

  /* ------------------------------- Event --------------------------------- */

  const event = useEventContext();

  const targetDate = useMemo(
    () => new Date(event?.schedule?.startTime ?? Date.now()),
    [event?.schedule?.startTime]
  );

  /* ------------------------------- State --------------------------------- */

  const [eventIsLive, setEventIsLive] = useState(() => Date.now() >= +targetDate);
  const [token, setToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [localRole, setLocalRole] = useState<ROLEBASED | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------- Prevent Re-fetch --------------------------- */

  const fetchedRef = useRef(false);

  /* ---------------------------- Live Timer -------------------------------- */

  useEffect(() => {
    if (eventIsLive) return;

    const interval = setInterval(() => {
      if (Date.now() >= +targetDate) {
        setEventIsLive(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventIsLive, targetDate]);

  /* -------------------------- Token Fetching ------------------------------ */

  useEffect(() => {
    if (!inviteId || fetchedRef.current) return;

    fetchedRef.current = true;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await axios.get<{ data: DailyJoinResponse }>(
          `${process.env.NEXT_PUBLIC_API_URL}/invite/join/${inviteId}`,
        );
        const { token, roomUrl } = res.data.data;

        const decoded = jwtDecode<DailyTokenPayload>(token);

        const extractedRole =
          decoded.is_owner === true
            ? ROLEBASED.MODERATOR
            : ROLEBASED.SPEAKER;

        setToken(token);
        setRoomUrl(roomUrl);
        setLocalRole(extractedRole);
      } catch (err: any) {
        // If the request was cancelled, ignore.
        if ((err as any)?.code === 'ERR_CANCELED') return;

        console.error('[SpeakerPage] Token fetch failed:', err);
        setError('Unable to verify speaker access.');
      }
    })();

    return () => controller.abort();
  }, [inviteId]);

  /* ------------------------------ Errors -------------------------------- */

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="max-w-md rounded-lg bg-gray-800 p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl text-red-500">⛔</div>
          <h2 className="mb-3 text-2xl font-bold text-white">
            Access Denied
          </h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  /* ----------------------------- Loading -------------------------------- */

  if (!token || !roomUrl || !localRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-lg text-white">
          Verifying speaker access…
        </div>
      </div>
    );
  }

  return (
    <EventStageLayout
      role={RoleView.Speaker}
      chatType={ChatSessionType.LIVE}
      chatTabs={[
        ChatCategoryType.EVERYONE,
        ChatCategoryType.BACKSTAGE,
      ]}
      title="Argyle"
    >
      <div className="flex-1 -mt-4 overflow-hidden">
        <SpeakerViewContent
          token={token}
          roomUrl={roomUrl}
          eventId={event._id!}
          role={localRole === ROLEBASED.MODERATOR ? ROLES.MODERATOR : ROLES.SPEAKER}
        />
      </div>
    </EventStageLayout>
  );
}
