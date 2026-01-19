'use client';

import { VideoPanel } from '@/components/stage/video/VideoPanel';
import { ROLES_ADMIN } from '@/app/auth/roles';

export function SpeakerStage({ eventId }: { eventId: string }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="relative w-[650px] aspect-[4/3] rounded-lg">
        <VideoPanel eventId={eventId} role={ROLES_ADMIN.Speaker} />
      </div>
    </div>
  );
}
