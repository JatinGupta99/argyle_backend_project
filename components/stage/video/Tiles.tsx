'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useLocalSessionId,
  useParticipantIds,
  DailyVideo,
} from '@daily-co/daily-react';

const VIDEOS_PER_PAGE = 6;

export default function Tiles() {
  const localId = useLocalSessionId();
  const remoteIds = useParticipantIds({ filter: 'remote' });
  const allIds = localId ? [localId, ...remoteIds] : [...remoteIds];

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(allIds.length / VIDEOS_PER_PAGE);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (page >= totalPages) setPage(0);
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
    <div className="relative h-full w-full bg-black">
      {/* Page indicator */}
      {totalPages > 1 && (
        <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/50 text-white text-xs rounded">
          Page {page + 1} / {totalPages}
        </div>
      )}

      {/* Video grid */}
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

        {/* Empty slots to keep grid consistent */}
        {Array.from({ length: VIDEOS_PER_PAGE - visibleIds.length }).map(
          (_, idx) => (
            <div key={`empty-${idx}`} className="rounded-md bg-gray-800/30" />
          )
        )}
      </div>
    </div>
  );
}
