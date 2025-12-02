'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { ROLEBASED, useDailyBase } from '@/hooks/useDailyBase';
import { DailyAudio, DailyProvider } from '@daily-co/daily-react';
import { useEffect, useState } from 'react';
import { VideoGrid } from './VideoGrid';

interface DailyRoomProps {
  role: ROLEBASED;
  startTime: Date;
  roomUrl: string;
  eventIsLive: boolean;
}

function DailyRoom({ role, startTime, roomUrl, eventIsLive }: DailyRoomProps) {
  const { hours, minutes, seconds } = useCountdown(startTime);
  const [userClickedJoin, setUserClickedJoin] = useState(false);

  const { callObject, ready, error } = useDailyBase(
    roomUrl,
    `Attendee_${Math.floor(Math.random() * 1000)}`,
    role,
    eventIsLive && userClickedJoin
  );

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
            className="mt-4 px-6 py-3 bg-green-500 rounded-lg text-white font-semibold"
          >
            Join Event
          </button>
        )}
      </div>
    );
  }

  if (eventIsLive && !userClickedJoin) {
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

  if (error) return <div className="text-red-600">{error}</div>;
  if (!callObject) return <div>Initializing call…</div>;
  if (!ready) return <div>Joining meeting…</div>;

  return (
    <DailyProvider callObject={callObject}>
      <DailyAudio autoSubscribeActiveSpeaker maxSpeakers={12} />
      <VideoGrid callObject={callObject} role={role} />
    </DailyProvider>
  );
}

export default DailyRoom;
