'use client';

import React, { useMemo } from 'react';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';
import { StageProviders } from '@/components/providers/StageProvider';

import { cn } from '@/lib/utils';
import { ROLES } from '@/app/auth/roles';
import { useAuth } from '@/app/auth/auth-context';

type Props = {
  role?: RoleView; // Keep for legacy compatibility during transition
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

  // Professional filtering: Only show tabs user has permission for
  const authorizedTabs = useMemo(() => {
    return chatTabs.filter(tab => {
      if (tab === ChatCategoryType.BACKSTAGE) {
        return can('chat:backstage');
      }
      return true; // Everyone and Q&A are public
    });
  }, [chatTabs, can]);

  return (
    <StageProviders>
      <div className={cn(
        "flex h-screen w-screen overflow-hidden",
        (userRole === ROLES.SPEAKER || userRole === ROLES.MODERATOR || _role === RoleView.Speaker) ? "bg-black" : "bg-background"
      )}>
        <aside className={cn(
          "h-full flex-shrink-0 flex flex-col shadow-sm z-10 transition-all duration-300",
          (userRole === ROLES.SPEAKER || userRole === ROLES.MODERATOR || _role === RoleView.Speaker) ? "bg-black" : "bg-[#FAFAFA]"
        )}>
          <ChatPanel
            title3={title ?? ChatTab.Everyone}
            role={(userRole as unknown as RoleView) || _role}
            eventId={eventId}
            currentUserId={userId}
            type={chatType}
            tabs={authorizedTabs}
          />
        </aside>

        <main className={cn(
          "flex flex-1 flex-col overflow-hidden relative",
          (userRole === ROLES.SPEAKER || userRole === ROLES.MODERATOR || _role === RoleView.Speaker) ? "bg-black" : "bg-background"
        )}>
          <Header title={event.title || 'Live Stage'} />
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>
        </main>
      </div>
    </StageProviders>
  );
}
