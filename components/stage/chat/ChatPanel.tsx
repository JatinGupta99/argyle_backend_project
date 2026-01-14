'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { ArrowLeftFromLine } from 'lucide-react';

import { YouTubeEmbed } from '@/components/shared/YouTubeEmbed';
import { ChatInputSection } from '@/components/stage/chat/ChatInputSection';
import { ChatMessages, ChatMessagesRef } from '@/components/stage/chat/ChatMessages';
import { ChatTabs } from '@/components/stage/chat/ChatTabs';

import { useMessages } from '@/hooks/useMessages';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatPanelProps } from '@/lib/types/components';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { getEventDownloadUrl } from '@/lib/event';
import { ChatTab } from '@/lib/slices/uiSlice';
import { cn } from '@/lib/utils';

export function ChatPanel({
  youtubeUrl: youtubeProp,
  title3 = ChatTab.Everyone,
  eventId,
  currentUserId,
  role,
  type = ChatSessionType.LIVE,
  tabs,
  collapsed: controlledCollapsed,
  onToggleCollapse,
}: ChatPanelProps & {
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const event = useEventContext();
  const chatRef = useRef<ChatMessagesRef>(null);

  const [activeCategory, setActiveCategory] = useState<ChatCategoryType>(
    () => {
      if (tabs.includes(ChatCategoryType.CHAT)) return ChatCategoryType.CHAT;
      return tabs[0] ?? ChatCategoryType.EVERYONE;
    }
  );
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;
  const setIsCollapsed = (value: boolean | ((prev: boolean) => boolean)) => {
    if (onToggleCollapse) {
      const newValue = typeof value === 'function' ? value(isCollapsed) : value;
      onToggleCollapse(newValue);
    } else {
      setInternalCollapsed(value);
    }
  };

  const [videoUrl, setVideoUrl] = useState<string | null>(youtubeProp ?? null);
  const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const {
    messages,
    isLoading,
    createMessage,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMessages(
    type,
    eventId,
    activeCategory
  );

  const sponsorMatch = useMemo(() => {
    const match = pathname?.match(/^\/sponsors\/([^/]+)\/(bill|meet)(\/.*)?$/);
    return match ? { sponsorId: match[1] } : null;
  }, [pathname]);

  useEffect(() => {
    if (!eventId || youtubeProp) return;

    const loadSponsorVideo = async () => {
      if (!sponsorMatch?.sponsorId) return;

      setIsLoadingVideo(true);
      setVideoError(null);

      try {
        const data = await apiClient.get(
          API_ROUTES.sponsor.fetchById(eventId, sponsorMatch.sponsorId)
        );

        const url = data.youtubeUrl ?? data.sponsor?.youtubeUrl;
        setVideoUrl(url?.trim() || null);
        if (!url) setVideoError('Sponsor video not available');
      } catch {
        setVideoError('Failed to load sponsor video');
        setVideoUrl(null);
      } finally {
        setIsLoadingVideo(false);
      }
    };

    const loadEventImage = async () => {
      try {
        const url = await getEventDownloadUrl(eventId);
        if (url) setImageSignedUrl(url);
      } catch {
        console.error('Failed to fetch event image');
      }
    };

    sponsorMatch ? loadSponsorVideo() : loadEventImage();
  }, [eventId, sponsorMatch, youtubeProp]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUserId) return;
      await createMessage(text);
      // Force scroll to bottom immediately after sending
      chatRef.current?.scrollToBottom();
    },
    [createMessage, currentUserId]
  );

  const activeLabel = useMemo(() => {
    switch (activeCategory) {
      case ChatCategoryType.EVERYONE: return 'Everyone';
      case ChatCategoryType.QA: return 'Q&A';
      case ChatCategoryType.CHAT: return 'Chat';
      case ChatCategoryType.BACKSTAGE: return 'Backstage';
      default: return 'Chat';
    }
  }, [activeCategory]);

  const topContent = useMemo(() => {
    if (videoUrl) {
      return (
        <div className="pt-2 pb-4 px-2">
          <YouTubeEmbed
            url={videoUrl}
            title="Sponsor Video"
            className="rounded-lg shadow-md overflow-hidden"
          />
        </div>
      );
    }

    return (
      <div className="pt-2 pb-4 px-2">
        <div className="aspect-video rounded-xl shadow-md bg-gray-100 overflow-hidden">
          <img
            src={imageSignedUrl || event.eventLogoUrl || '/placeholder.svg'}
            alt={event.title || 'Event'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }, [videoUrl, imageSignedUrl, event]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background text-foreground overflow-hidden transition-all duration-300 ease-in-out z-20 relative",
        isCollapsed ? "w-[60px]" : "w-full md:w-[300px]"
      )}
    >
      {/* Header */}
      <header className="h-16 px-0 flex items-center justify-between bg-card relative">
        <div className={cn(
          "absolute left-4 transition-opacity duration-200",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <h2 className="text-[22px] font-bold text-[#000000] tracking-tight truncate">
            {activeLabel}
          </h2>
        </div>

        <button
          onClick={() => setIsCollapsed(v => !v)}
          aria-label={isCollapsed ? 'Expand chat' : 'Collapse chat'}
          className={cn(
            "p-1.5 rounded-xl hover:bg-background/50 transition absolute",
            isCollapsed ? "left-1/2 -translate-x-1/2" : "right-4"
          )}
        >
          <ArrowLeftFromLine
            size={24}
            className={cn(
              'stroke-[3px] text-[#1c97d4] transition-transform duration-300',
              isCollapsed && 'rotate-180'
            )}
          />
        </button>
      </header>

      {/* Collapsible Content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 overflow-hidden w-full',
        )}
      >
        <div className="flex-none">
          <ChatTabs
            tabs={tabs}
            activeTab={activeCategory}
            onChangeTab={setActiveCategory}
            collapsed={isCollapsed}
          />
        </div>

        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isCollapsed ? "opacity-0 pointer-events-none h-0" : "opacity-100"
        )}>
          <div className="flex-none">
            {isLoadingVideo ? (
              <p className="text-center py-4 text-gray-500 italic">
                Loading content...
              </p>
            ) : videoError ? (
              <p className="text-center py-4 text-red-500 text-sm">
                {videoError}
              </p>
            ) : (
              topContent
            )}
          </div>


          <div className="flex items-center px-6 py-4 gap-4">
            <div className="flex-1 h-px bg-[#1c97d4]/20" />
            <span className="text-sm font-bold text-[#1c97d4]">Today</span>
            <div className="flex-1 h-px bg-[#1c97d4]/20" />
          </div>

          <div className="flex-1 min-h-0 px-2">
            <ChatMessages
              ref={chatRef}
              key={activeCategory}
              messages={messages ?? []}
              isLoading={isLoading}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>

          <div className="flex-none">
            <ChatInputSection
              onSend={handleSendMessage}
              disabled={isLoading || isLoadingVideo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
