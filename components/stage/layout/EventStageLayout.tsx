'use client';

import React from 'react';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab,RoleView } from '@/lib/slices/uiSlice.ts';
import { StageProviders } from '@/components/providers/StageProvider';

type Props = {
  role: RoleView;
  chatType: ChatSessionType;
  chatTabs: ChatCategoryType[];
  title?: ChatTab | string;
  children: React.ReactNode;
};

export function EventStageLayout({ role, chatType, chatTabs, title, children }: Props) {
  const event = useEventContext();
  const eventId = event._id as string;
  const userId = UserID;

  return (
    <StageProviders>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
          <ChatPanel
            title3={title ?? ChatTab.Everyone}
            role={role}
            eventId={eventId}
            currentUserId={userId}
            type={chatType}
            tabs={chatTabs}
          />
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden bg-white">
          <Header title={event.title || ''} />
          {children}
        </main>
      </div>
    </StageProviders>
  );
}
