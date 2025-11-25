'use client';

import { useDailyRoomConnector } from '@/hooks/useDailyRoom';
import { DailyProvider } from '@daily-co/daily-react';
import Tiles from './Tiles';

interface DailyRoomProps {
  roomUrl: string;
}

export function DailyRoom({ roomUrl }: DailyRoomProps) {
  const { callObject, error } = useDailyRoomConnector({ roomUrl });

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 bg-red-50 text-red-800">
        <div className="max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Unable to join meeting</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Please check your connection or contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!callObject) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900 text-white">
        <p>Initializing video session...</p>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <Tiles />
    </DailyProvider>
  );
}
