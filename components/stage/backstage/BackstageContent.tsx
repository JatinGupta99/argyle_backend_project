'use client';

import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface BackstageContentProps {
  targetDate: Date;
}

export function BackstageContent({ targetDate }: BackstageContentProps) {
  const { hours, minutes, seconds, done } = useCountdown(targetDate);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white">
      <h1 className="text-2xl font-semibold mb-4">Backstage Countdown</h1>
      {done ? (
        <p className="text-xl font-bold text-green-400 animate-pulse">
          Event is Live Now!
        </p>
      ) : (
        <p className="text-lg">
          Event starts in{' '}
          <span className="font-mono text-2xl">
            {hours.toString().padStart(2, '0')}:
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </span>
        </p>
      )}
    </div>
  );
}
