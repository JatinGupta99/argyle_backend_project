'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab, RoleView } from '@/lib/slices/uiSlice';

interface BaseEventLayoutProps {
  children: React.ReactNode;
  role: RoleView;
  title: string;
  eventId: string;
}

export function BaseEventLayout({
  children,
  role,
  title,
  eventId,
}: BaseEventLayoutProps) {
  const userId = UserID;

  const attendeeTabs = [ChatCategoryType.CHAT, ChatCategoryType.QA];
  const speakerTabs = [ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE];

  const chatTabs = role === RoleView.Attendee ? attendeeTabs : speakerTabs;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* Left Chat Sidebar */}
          <aside className="w-[27%] border-r border-gray-200 bg-[#FAFAFA]">
            <ChatPanel
              title3={ChatTab.Chat}
              role={role}
              eventId={eventId}
              currentUserId={userId}
              type={ChatSessionType.LIVE}
              tabs={chatTabs}
            />
          </aside>

          {/* Main Content */}
          <main className="flex flex-col flex-1 overflow-hidden">
            <Header title={title} />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
