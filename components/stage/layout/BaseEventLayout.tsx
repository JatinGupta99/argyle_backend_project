'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { useAuth } from '@/app/auth/auth-context';

interface BaseEventLayoutProps {
  children: React.ReactNode;
  role: ROLES_ADMIN;
  title: string;
  eventId: string;
}

export function BaseEventLayout({
  children,
  role,
  title,
  eventId,
}: BaseEventLayoutProps) {
  const { userId } = useAuth();

  const attendeeTabs = [ChatCategoryType.CHAT, ChatCategoryType.QA];
  const speakerTabs = [ChatCategoryType.EVERYONE, ChatCategoryType.BACKSTAGE];

  const chatTabs = role === ROLES_ADMIN.Attendee ? attendeeTabs : speakerTabs;

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* Left Chat Sidebar */}
          <aside className="h-full flex-shrink-0 border-r border-gray-200 bg-[#FAFAFA] transition-all duration-300">
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
