'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { DailyTokenPayload } from '@/lib/types/daily';
import DailyIframe from '@daily-co/daily-js';
import { getTokenPayload } from '@/lib/utils/jwt-utils';
import { Role } from '@/app/auth/roles';
import { useEffect, useMemo, useRef, useState } from 'react';

interface DailyRoomProps {
  token?: string;
  startTime: Date;
  roomUrl?: string;
  eventIsLive: boolean;
  role?: Role;
}

function DailyRoom({ token, startTime, roomUrl, eventIsLive, role }: DailyRoomProps) {
  const { hours, minutes, seconds } = useCountdown(startTime);
  const [userClickedJoin, setUserClickedJoin] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);

  const decoded = useMemo(() => {
    if (!token) return null;
    return getTokenPayload<DailyTokenPayload>(token);
  }, [token]);
  console.log('Decoded Daily token:', decoded);
  const detectedRole = decoded?.u ?? 'attendee';
  useEffect(() => {
    if (!eventIsLive || !userClickedJoin || !iframeRef.current) return;

    if (!callFrameRef.current) {
      callFrameRef.current = DailyIframe.createFrame(iframeRef.current, {
        iframeStyle: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '12px',
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });

      callFrameRef.current
        .join({ url: roomUrl, token })
        .then(() => {
          console.log(' Joined Daily room as', detectedRole);
        })
        .catch((error: any) => {
          console.error(' Failed to join Daily room:', error);
        });
    }
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave();
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [eventIsLive, userClickedJoin, roomUrl, token, detectedRole]);

  if (!eventIsLive) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-2">
        <p className="text-lg">Event starts in</p>
        <p className="font-bold text-green-400 animate-pulse font-mono text-2xl">
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </p>
        {seconds <= 0 && !userClickedJoin && (
          <button
            onClick={() => setUserClickedJoin(true)}
            className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors"
          >
            Join Event
          </button>
        )}
      </div>
    );
  }

  if (!userClickedJoin) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-4">
        <div className="text-center">
          {/* <div className="inline-block px-3 py-1 bg-red-600 rounded-full text-xs font-bold mb-3 animate-pulse">
            🔴 LIVE
          </div> */}
          <p className="text-xl font-semibold">Event is Live!</p>
          <p className="text-gray-400 mt-2">
            Joining as: <span className="text-green-400 capitalize">{detectedRole}</span>
          </p>
        </div>
        <button
          onClick={() => setUserClickedJoin(true)}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors shadow-lg"
        >
          Join Event Now
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div ref={iframeRef} className="w-full h-full" />
    </div>
  );
}

export default DailyRoom;
