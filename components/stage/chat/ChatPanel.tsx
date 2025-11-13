'use client';

import { ChatInputSection } from '@/components/stage/chat/ChatInputSection';
import { ChatMessages } from '@/components/stage/chat/ChatMessages';
import { ChatTabs } from '@/components/stage/chat/ChatTabs';
import { SessionCard } from '@/components/stage/session-card';
import { useMessages } from '@/hooks/useMessages';
import { EventId } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice.ts';
import { ChatPanelProps } from '@/lib/types/components';
import { ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
export function ChatPanel({
  title3 = ChatTab.Everyone,
  eventId,
  currentUserId,
  role,
  type = ChatSessionType.LIVE,
  tabs,
}: ChatPanelProps) {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<ChatCategoryType>(
    tabs[0] || ChatCategoryType.EVERYONE
  );

  const { messages, isLoading, createMessage, refetch } = useMessages(
    type,
    eventId,
    activeCategory
  );

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUserId) return;
      setIsSending(true);
      try {
        await createMessage(text, currentUserId);
        await refetch();
      } finally {
        setIsSending(false);
      }
    },
    [createMessage, currentUserId, refetch]
  );

  return (
    <div className="flex flex-col h-full bg-blue-50 border-gray-200 text-gray-900 w-full">
      {/* Header */}
      <header className="flex-shrink-0 bg-blue-50 px-4 h-14 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title3}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </header>

      {/* Tabs passed from parent */}
      <ChatTabs
        tabs={tabs}
        activeTab={activeCategory}
        onChangeTab={(tab) => setActiveCategory(tab)}
      />

      {/* Optional session card */}
      <div className="pt-2 pb-4 pl-2 flex-shrink-0 w-[85%] scale-110">
        <SessionCard
          imageSrc="/images/event_image.png"
          title="Redefining Traditional Leader"
        />
      </div>

      {/* Divider */}
      <div className="px-3 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-blue-600" />
          <span className="text-xs text-blue-600 font-semibold">Today</span>
          <div className="h-px flex-1 bg-blue-600" />
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages ?? []} isLoading={isLoading} />
      </div>

      {/* Input field */}
      <ChatInputSection
        onSend={handleSendMessage}
        disabled={isSending || isLoading}
      />
    </div>
  );
}
