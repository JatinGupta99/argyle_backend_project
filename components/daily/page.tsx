'use client';

import React, { useRef, useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

interface DailyRoomProps {
  roomUrl: string;
}

export default function DailyRoom({ roomUrl }: DailyRoomProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState<DailyCall | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Safety: Wait for the container to actually mount
    if (!roomUrl) {
      setError('Missing Daily room URL');
      return;
    }
    if (!containerRef.current) {
      console.warn('Container not ready yet');
      return;
    }

    console.log('Creating Daily iframe in:', containerRef.current);

    // ✅ Create the Daily Prebuilt iframe
    const callFrame = DailyIframe.createFrame(containerRef.current, {
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '8px',
      },
      showLeaveButton: true,
    });

    setFrame(callFrame);

    // ✅ Join the Daily room
    callFrame
      .join({ url: roomUrl })
      .then(() => {
        console.log('✅ Joined Daily room successfully');
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error joining Daily room:', err);
        setError(err?.message || 'Failed to join Daily room');
        setLoading(false);
      });

    // ✅ Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up Daily room...');
      callFrame.leave().catch(() => {});
      callFrame.destroy();
    };
  }, [roomUrl]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-red-100 text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Connecting to Daily room...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black flex items-center justify-center rounded-lg"
      id="daily-container"
    />
  );
}
