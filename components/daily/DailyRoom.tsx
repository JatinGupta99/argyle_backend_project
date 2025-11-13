'use client';
import { DailyProvider } from '@daily-co/daily-react';
import { VideoGrid } from './VideoGrid';
export default function DailyRoom() {
  return (
    <DailyProvider >
      <VideoGrid />
    </DailyProvider>
  );
}
