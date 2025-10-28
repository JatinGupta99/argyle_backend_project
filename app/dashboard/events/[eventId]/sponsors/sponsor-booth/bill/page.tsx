'use client';
import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { EventId, UserID } from '@/lib/constants/api';

export default function SponsorBoothBillPage() {
  return (
    <div className="flex h-screen ">

      {/* ====== Chat Panel (Immediately Next to Sidebar) ====== */}
      <div className="flex-shrink-0 w-[290px] bg-white  border-gray-200">
        <AppSidebar />
        <ChatPanel
          title1="Chat"
          title2="Q&A"
          title3="Chat"
          role="speaker"
          eventId={EventId}
          currentUserId={UserID}
        />
      </div>

      {/* ====== Main Content Section ====== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
        <div className="flex-1 overflow-auto">
          <SponsorDetails />
        </div>
      </div>
    </div>
  );
}
