'use client';

import { useEffect, useMemo } from 'react';
import DailyIframe, { type DailyCall } from '@daily-co/daily-js';
import {
  DailyProvider,
  useLocalSessionId,
  useParticipantIds,
  DailyVideo,
} from '@daily-co/daily-react';

function Tiles() {
  const localId = useLocalSessionId();
  const remoteIds = useParticipantIds({ filter: 'remote' });

  return (
    <div className="absolute inset-0 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {localId && (
        <div className="relative rounded-md overflow-hidden border bg-background/40">
          <DailyVideo automirror sessionId={localId} />
          <div className="absolute bottom-1 left-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px]">
            You
          </div>
        </div>
      )}
      {remoteIds.map((id) => (
        <div
          key={id}
          className="relative rounded-md overflow-hidden border bg-background/40"
        >
          <DailyVideo sessionId={id} />
        </div>
      ))}
    </div>
  );
}

export function DailyRoom({ roomUrl }: { roomUrl: string }) {
  const callObject: DailyCall | null = useMemo(
    () => DailyIframe.createCallObject(),
    []
  );

  useEffect(() => {
    let mounted = true;
    if (!callObject) return;
    (async () => {
      try {
        console.log('[v0] Joining Daily room:', roomUrl);
        await callObject.join({ url: roomUrl });
      } catch (e) {
        console.error('[v0] Daily join failed:', (e as Error).message);
      }
    })();
    return () => {
      // Cleanup leaves and destroys the call when component unmounts
      if (!mounted || !callObject) return;
      mounted = false;
      callObject
        .leave()
        .catch(() => {})
        .finally(() => {
          callObject.destroy();
        });
    };
  }, [callObject, roomUrl]);

  if (!callObject) return null;

  return (
    <DailyProvider callObject={callObject}>
      <Tiles />
    </DailyProvider>
  );
}
