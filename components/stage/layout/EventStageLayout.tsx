'use client';

import React, { useMemo } from 'react';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import { StageProviders } from '@/components/providers/StageProvider';

import { useAuth } from '@/app/auth/auth-context';

type Props = {
  role?: RoleView;
  chatType: ChatSessionType;
  chatTabs: ChatCategoryType[];
  title?: ChatTab | string;
  children: React.ReactNode;
};

export function EventStageLayout({
  role: _role,
  chatType,
  chatTabs,
  title,
  children,
}: Props) {
  const event = useEventContext();
  const { can, role: userRole } = useAuth();
  const eventId = event._id as string;
  const userId = UserID;
  const authorizedTabs = useMemo(() => {
    return chatTabs.filter(tab => {
      if (tab === ChatCategoryType.BACKSTAGE) {
        return can('chat:backstage');
      }
      return true;
    });
  }, [chatTabs, can]);

  return (
    <StageProviders>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200 shadow-sm z-10">
          <ChatPanel
            title3={title ?? ChatTab.Everyone}
            role={(userRole as unknown as RoleView) || _role}
            eventId={eventId}
            currentUserId={userId}
            type={chatType}
            tabs={authorizedTabs}
          />
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden bg-[#FFFFFF] relative">
          <Header title={event.title || 'Live Stage'} />
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>
        </main>
      </div>
    </StageProviders>
  );
}
