import { BackstageContent } from '@/components/stage/backstage/BackstageContent';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EventId, UserID } from '@/lib/constants/api';
import { RoleView } from '@/lib/slices/uiSlice.ts';
import { ChatType } from '@/lib/constants/chat';

const targetDate = new Date('2025-11-01T15:00:00Z');

export default function BackstagePage() {
  const chatRole: RoleView = 'speaker';

  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Chat Panel */}
          <div className="w-[310px] border-r border-gray-200">
            <ChatPanel
              title1="Everyone"
              title2="Backstage"
              title3="Everyone"
              role={chatRole}
              eventId={EventId}
              currentUserId={UserID}
              type={ChatType.LIVE}
            />
          </div>

          {/* Main Backstage Area */}
          <div className="flex flex-col flex-1 overflow-hidden bg-white">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <BackstageContent targetDate={targetDate} />
          </div>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
