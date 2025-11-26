'use client';
import DailyRoom from '@/components/daily/DailyRoom';
import { EventStageLayout } from '@/components/stage/layout/EventStageLayout';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { UserID } from '@/lib/constants/api';
import { RoleView } from '@/lib/slices/uiSlice.ts';

export default function AttendeeViewProfilePage() {
  const userId = UserID;

  return (
   <div className='bg-sky-50'>
     <EventStageLayout
      role={RoleView.Attendee}
      chatType={ChatSessionType.LIVE}
      chatTabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
    >
      <div className="flex-1  overflow-y-auto flex items-center justify-center">
        <DailyRoom />
      </div>
    </EventStageLayout>
   </div>
  );
}
