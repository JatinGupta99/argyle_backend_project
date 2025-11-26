'use client';
import { DailyProvider, DailyAudio } from '@daily-co/daily-react';
import { useDailyRoomConnector } from '@/hooks/useDailyRoom';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { VideoGrid } from './VideoGrid';

export default function DailyRoom() {
  const event = useEventContext();
  const { callObject, isRoomReady, error } = useDailyRoomConnector(event);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!isRoomReady || !callObject) return <div>Loading…</div>;

  return (
    <DailyProvider callObject={callObject}>
      <DailyAudio autoSubscribeActiveSpeaker maxSpeakers={12} />
      <VideoGrid />
    </DailyProvider>
  );
}
