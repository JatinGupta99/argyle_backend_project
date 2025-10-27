'use client';

import { ChatPanel } from '@/components/stage/ChatPanel';
import { Header } from '@/components/stage/layout/Header';
import SponsorDetails from '@/components/stage/sponsor-details/SponsorDetails';
import { EventId, UserID } from '@/lib/constants/api';

export default function SponsorBoothBillPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Chat Panel */}
      <div className="w-[310px] border-r border-gray-200 bg-white">
        <ChatPanel
         title1="Chat"
          title2="Q&A"
          title3="Chat"
          role="speaker"
          eventId={EventId}
          currentUserId={UserID}
        />
      </div>

      {/* Main Section */}
      <div className="flex flex-1 flex-col">
        <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
        <div className="flex-1 overflow-auto">
          <SponsorDetails />
        </div>
      </div>
    </div>
  );
}
