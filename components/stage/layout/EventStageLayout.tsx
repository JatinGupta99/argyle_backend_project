'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { StageProviders } from '@/components/providers/StageProvider';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice';
import React, { useMemo } from 'react';

import { useAuth } from '@/app/auth/auth-context';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { cn } from '@/lib/utils';

type Props = {
  role?: ROLES_ADMIN;
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
  const { can, role: userRole, userId } = useAuth();
  const eventId = event._id as string;

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
        (userRole === ROLES_ADMIN.Speaker || userRole === ROLES_ADMIN.Moderator || _role === ROLES_ADMIN.Speaker) ? "bg-black" : "bg-background"
      )}>
        <aside className={cn(
          "h-full flex-shrink-0 flex flex-col shadow-sm z-10 transition-all duration-300",
          (userRole === ROLES_ADMIN.Speaker || userRole === ROLES_ADMIN.Moderator || _role === ROLES_ADMIN.Speaker) ? "bg-black" : "bg-[#FAFAFA]"
        )}>
          <ChatPanel
            title3={title ?? ChatTab.Everyone}
            role={userRole || _role || ROLES_ADMIN.Attendee}
            eventId={eventId}
            currentUserId={userId || undefined}
            type={chatType}
            tabs={authorizedTabs}
          />
        </aside>

        <main className={cn(
          "flex flex-1 flex-col overflow-hidden relative",
          (userRole === ROLES_ADMIN.Speaker || userRole === ROLES_ADMIN.Moderator || _role === ROLES_ADMIN.Speaker) ? "bg-black" : "bg-background"
        )}>
          <Header
            title={title || event.title || 'Live Stage'}
          />
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>
        </main>
      </div>
    </StageProviders>
  );
}
