'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { VideoTile } from './VideoTile';
import { usePlayableParticipants } from '@/hooks/usePlayableParticipants';
import useGridLayout from '@/hooks/useGridLayout';
import { GRID_CONFIG } from '@/lib/constants/grid';

export function VideoGrid() {
  const playableIds = usePlayableParticipants();

  const [page, setPage] = useState(0);
  const totalPages = Math.max(
    1,
    Math.ceil(playableIds.length / GRID_CONFIG.VIDEOS_PER_PAGE)
  );

  const visibleIds = playableIds.slice(
    page * GRID_CONFIG.VIDEOS_PER_PAGE,
    (page + 1) * GRID_CONFIG.VIDEOS_PER_PAGE
  );

  const { gridTemplateColumns, gridTemplateRows } = useGridLayout(
    visibleIds.length
  );

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (totalPages <= 1) return;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        setPage((prev) =>
          e.deltaY > 0
            ? (prev + 1) % totalPages
            : (prev - 1 + totalPages) % totalPages
        );
      }, GRID_CONFIG.SCROLL_DEBOUNCE_MS);
    },
    [totalPages]
  );

  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [page, totalPages]);

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setHasLoadedOnce(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden select-none"
      onWheel={handleScroll}
    >
      {totalPages > 1 && (
        <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-blue/60 text-white text-xs rounded">
          Page {page + 1} / {totalPages}
        </div>
      )}

      <div
        className="absolute inset-0 p-4 gap-4 bg-white grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateColumns, gridTemplateRows }}
      >
        {visibleIds.length > 0 ? (
          visibleIds.map((id) => <VideoTile key={id} id={id} />)
        ) : hasLoadedOnce ? (
          <div className="col-span-full flex items-center justify-center text-gray-700 text-sm">
            No participants with camera on
          </div>
        ) : (
          <div className="col-span-full flex items-center justify-center text-gray-400 text-sm">
            Loading participants...
          </div>
        )}
      </div>
    </div>
  );
}
