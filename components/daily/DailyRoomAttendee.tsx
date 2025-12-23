'use client';

import React, { useState, useEffect } from 'react';
import { DailyAudio, DailyProvider } from '@daily-co/daily-react';
import { useDailyBase, ROLEBASED } from '@/hooks/useDailyBase';
import { useCountdown } from '@/hooks/useCountdown';
import { VideoGrid } from './VideoGrid';
import { fetchMeetingToken } from '@/lib/api/daily';

export interface DailyRoomProps {
  role: ROLEBASED;
  startTime: Date;
  roomUrl: string;
  eventIsLive: boolean;
  eventId: string;
}

export function DailyRoomAttendee({ role, startTime, roomUrl, eventIsLive, eventId }: DailyRoomProps) {
  const { hours, minutes, seconds } = useCountdown(startTime);
  const [userClickedJoin, setUserClickedJoin] = useState(false);

  /* 
   * Memoize the username so it doesn't change on every render (e.g. countdown ticks).
   */
  const [userName] = useState(() => `Attendee_${Math.floor(Math.random() * 1000)}`);
  /*
   * Fetch token if we don't have one and event is live.
   * This is required if the room is private.
   */
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (eventIsLive && !token && eventId) {
      fetchMeetingToken(eventId).then(setToken);
    }
  }, [eventIsLive, token, eventId]);

  /*
   * Corrected useDailyBase call:
   * 1. roomUrl
   * 2. enable: userClickedJoin (only join when user clicks)
   * 3. userName: passed explicitly
   * 4. token: fetched token (or null)
   */
  const { callObject, ready, error } = useDailyBase(
    roomUrl,
    userClickedJoin,
    userName,
    token
  );

  console.log('DailyBase:', { callObject, ready, error });

  // Event not started yet → show countdown
  if (!eventIsLive) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-2">
        <p className="text-lg">Event starts in</p>
        <p className="font-bold text-green-400 animate-pulse font-mono text-2xl">
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </p>
      </div>
    );
  }
  console.log(hours, minutes, seconds, userClickedJoin, 'USER CLICKED JOIN STATUS');

  // Event is live but user has not clicked join → show Join button
  if (!userClickedJoin) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-4">
        <p className="text-lg">Event is live!</p>
        <button
          onClick={() => setUserClickedJoin(true)}
          className="px-6 py-3 bg-green-500 rounded-lg text-white font-semibold"
        >
          Join Event
        </button>
      </div>
    );
  }

  // Error or loading states
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-4 p-6 text-center">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-xl font-bold text-red-500">Connection Failed</h3>
        <p className="text-gray-300 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (!callObject) return <div>Initializing call…</div>;
  if (!ready) return <div>Joining meeting…</div>;

  // User clicked Join → show video grid
  return (
    <DailyProvider callObject={callObject}>
      <DailyAudio autoSubscribeActiveSpeaker maxSpeakers={12} />
      <VideoGrid callObject={callObject} />
    </DailyProvider>
  );
}
