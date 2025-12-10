'use client';

import { VideoPanel } from '@/components/stage/video/VideoPanel';
import { ROLEBASED } from '@/lib/types/daily';

export function SpeakerStage({ eventId }: { eventId: string }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-white">
      <div className="relative w-[650px] aspect-[4/3] rounded-lg">
        <VideoPanel eventId={eventId} role={ROLEBASED.SPEAKER} />
      </div>
    </div>
  );
}
