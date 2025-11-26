'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { BackstageContent } from '@/components/stage/backstage/BackstageContent';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { RoleView } from '@/lib/slices/uiSlice.ts';


export default function BackstagePage() {
  const event = useEventContext();
  const eventStartTime = event.schedule.startTime as Date;

  return (
    <EventStageLayout
      role={RoleView.Speaker}
      chatType={ChatSessionType.PRE_LIVE}
      chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE]}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <BackstageContent targetDate={eventStartTime} />
      </div>
    </EventStageLayout>
  );
}
