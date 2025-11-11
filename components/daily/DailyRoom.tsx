'use client';
import { type DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';
import { VideoGrid } from './VideoGrid';

interface DailyRoomProps {
  callObject: DailyCall;
}

export default function DailyRoom({ callObject }: DailyRoomProps) {
  return (
    <DailyProvider callObject={callObject}>
      <VideoGrid />
    </DailyProvider>
  );
}
