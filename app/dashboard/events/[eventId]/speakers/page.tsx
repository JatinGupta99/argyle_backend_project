'use client';

import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { SpeakerStage } from '@/components/stage/views/SpeakerStage';
import { EventId, UserID } from '@/lib/constants/api';

interface SpeakerPageProps {
  params: { eventId: string };
}

export default function SpeakerPage({ params }: SpeakerPageProps) {
  // const { eventId } = params;

  return (
    <div className="flex h-screen">
      {/* Chat Panel */}
      <div className="w-[310px] border-r border-gray-200">
        <ChatPanel
          title1="Everyone"
          title2="Backstage"
          title3="Chat with Argyle here"
          role="speaker"
          eventId={EventId}
          currentUserId={UserID}
        />
      </div>

      {/* Speaker Stage */}
      <div className="flex-1 flex flex-col">
        <Header title="" />
        <div className="flex-1">
          <SpeakerStage eventId={EventId} />
        </div>
      </div>
    </div>
  );
}
