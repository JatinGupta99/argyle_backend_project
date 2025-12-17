'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'next/navigation';

import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { useEventContext } from '@/components/providers/EventContextProvider';
import DailyRoom from '@/components/daily/DailyRoom';

import {
  ROLEBASED,
  DailyTokenPayload,
  DailyJoinResponse,
} from '@/lib/types/daily';
import { RoleView } from '@/lib/slices/uiSlice.ts';

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function SpeakerPage() {
  /* ------------------------------- Params -------------------------------- */

  const { inviteId } = useParams<{ inviteId: string }>();

  /* ------------------------------- Event --------------------------------- */

  const { schedule } = useEventContext();

  const targetDate = useMemo(
    () => new Date(schedule.startTime),
    [schedule.startTime]
  );

  /* ------------------------------- State --------------------------------- */

  const [eventIsLive, setEventIsLive] = useState(() => Date.now() >= +targetDate);
  const [token, setToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [role, setRole] = useState<ROLEBASED | null>(null);
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
        setRole(extractedRole);
      } catch (err: any) {
        if (axios.isCancel(err)) return;

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

  if (!token || !roomUrl || !role) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-lg text-white">
          Verifying speaker access…
        </div>
      </div>
    );
  }

  /* ------------------------------ Render -------------------------------- */

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
        <DailyRoom
          token={token}
          roomUrl={roomUrl}
          startTime={targetDate}
          eventIsLive={eventIsLive}
        />
      </div>
    </EventStageLayout>
  );
}
