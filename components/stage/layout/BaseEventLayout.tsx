'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice.ts';

interface BaseEventLayoutProps {
  children: React.ReactNode;
  role: RoleView;
  eventId: string;
  title: string;
}

export function BaseEventLayout({
  children,
  role,
  eventId,
  title,
}: BaseEventLayoutProps) {
  const userId = UserID;

  const chatTabs =
    role === RoleView.Attendee
      ? [ChatCategoryType.CHAT, ChatCategoryType.QA]
      : [ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE];

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <aside className="w-[27%] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-gray-200">
            <ChatPanel
              title3={ChatTab.Chat}
              role={role}
              eventId={eventId}
              currentUserId={userId}
              type={ChatSessionType.LIVE}
              tabs={chatTabs}
            />
          </aside>

          <main className="flex flex-col flex-1 overflow-hidden bg-background">
            <Header title={title} />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
