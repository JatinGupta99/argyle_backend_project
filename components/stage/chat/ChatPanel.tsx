'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeftFromLine } from 'lucide-react';

import { YouTubeEmbed } from '@/components/shared/YouTubeEmbed';
import { ChatInputSection } from '@/components/stage/chat/ChatInputSection';
import { ChatMessages } from '@/components/stage/chat/ChatMessages';
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
}: ChatPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const event = useEventContext();

  const [activeCategory, setActiveCategory] = useState<ChatCategoryType>(
    tabs[0] ?? ChatCategoryType.EVERYONE
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(youtubeProp ?? null);
  const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const { messages, isLoading, createMessage, refetch } = useMessages(
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
      await createMessage(text, currentUserId);
      refetch();
    },
    [createMessage, currentUserId, refetch]
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
            className="rounded-lg border shadow-md overflow-hidden"
          />
        </div>
      );
    }

    return (
      <div className="pt-2 pb-4 px-2">
        <div className="aspect-video rounded-xl border shadow-md bg-gray-100 overflow-hidden">
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
        "flex flex-col h-full bg-blue-50/50 border-gray-200 text-gray-900 overflow-hidden transition-all duration-300 ease-in-out z-20 relative",
        isCollapsed ? "w-[60px]" : "w-full md:w-[400px]"
      )}
    >
      {/* Header */}
      <header className="h-16 px-0 flex items-center justify-between bg-blue-50/20 relative">
        <div className={cn(
          "absolute left-4 transition-opacity duration-200",
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          <h2 className="text-[22px] font-black tracking-tight truncate">
            {activeLabel}
          </h2>
        </div>

        <button
          onClick={() => setIsCollapsed(v => !v)}
          aria-label={isCollapsed ? 'Expand chat' : 'Collapse chat'}
          className={cn(
            "p-1.5 rounded-xl hover:bg-white/50 transition absolute",
            isCollapsed ? "left-1/2 -translate-x-1/2" : "right-4"
          )}
        >
          <ArrowLeftFromLine
            size={24}
            className={cn(
              'stroke-[3px] text-sky-500 transition-transform duration-300',
              isCollapsed && 'rotate-180'
            )}
          />
        </button>
      </header>

      {/* Collapsible Content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 overflow-hidden w-full',
          isCollapsed && 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex-none">
          <ChatTabs
            tabs={tabs}
            activeTab={activeCategory}
            onChangeTab={setActiveCategory}
          />
        </div>

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
          <div className="flex-1 h-px bg-sky-200/50" />
          <span className="text-sm font-bold text-sky-500">Today</span>
          <div className="flex-1 h-px bg-sky-200/50" />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-2">
          <ChatMessages
            key={activeCategory}
            messages={messages ?? []}
            isLoading={isLoading}
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
  );
}
