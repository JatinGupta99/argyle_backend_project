'use client';

import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { SpeakerStage } from '@/components/stage/views/SpeakerStage';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { RoleView } from '@/lib/slices/uiSlice.ts';

export default function SpeakerPage() {
  const event = useEventContext();

  return (
    <EventStageLayout
      role={RoleView.Speaker}
      chatType={ChatSessionType.LIVE}
      chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
      title={'Argyle'}
    >
      <div className="flex-1 overflow-hidden -mt-4">
        <SpeakerStage eventId={event._id} />
      </div>
    </EventStageLayout>
  );
}
