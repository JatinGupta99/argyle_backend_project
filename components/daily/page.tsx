'use client';

import React, { useEffect, useState, useRef } from 'react';
import DailyIframe, { type DailyCall } from '@daily-co/daily-js';
import {
  DailyProvider,
  useLocalSessionId,
  useParticipantIds,
  DailyVideo,
} from '@daily-co/daily-react';

const VIDEOS_PER_PAGE = 6;

function Tiles() {
  const localId = useLocalSessionId();
  const remoteIds = useParticipantIds({ filter: 'remote' });
  const allIds = localId ? [localId, ...remoteIds] : [...remoteIds];

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(allIds.length / VIDEOS_PER_PAGE);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
   
    if (page >= totalPages) {
      setPage(0);
    }
  }, [totalPages, page]);

  useEffect(() => {
    if (totalPages <= 1) return;

    timeoutRef.current = setTimeout(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 5000);  

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [page, totalPages]);

  const startIndex = page * VIDEOS_PER_PAGE;
  const visibleIds = allIds.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  return (
    <div className="relative h-full w-full">
      {/* Optional page indicator */}
      <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/50 text-white text-xs rounded">
        Page {totalPages > 0 ? page + 1 : 0} / {totalPages}
      </div>

      <div className="absolute inset-0 p-4 grid grid-cols-3 grid-rows-2 gap-4">
        {visibleIds.map((id) => (
          <div
            key={id}
            className="relative rounded-md overflow-hidden border bg-background/40"
          >
            <DailyVideo type="video" sessionId={id} />
            <div className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
              {id === localId ? 'You' : `User: ${id.slice(0, 4)}...`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DailyRoom({
  callObject,
  roomUrl,
}: {
  callObject: DailyCall;
  roomUrl: string;
}) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    callObject.join({ url: roomUrl }).catch((err: any) => {
      console.error('Join error:', err);

      
      if (typeof err === 'string') {
        setError(err);
      } else if (err?.error) {
       
        if (err.error === 'account-missing-payment-method') {
          setError(
            'Your Daily account is missing a payment method. Please update your billing information.'
          );
        } else {
          setError(`Error joining the meeting: ${err.error}`);
        }
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while joining the meeting.');
      }
    });

    return () => {
      callObject.leave().catch(() => {});
    };
  }, [callObject, roomUrl]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4 bg-red-100 text-red-800">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to join meeting</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-700">
            Please check your connection, billing info, or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <Tiles />
    </DailyProvider>
  );
}
