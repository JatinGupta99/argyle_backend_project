'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
import { ArrowLeftFromLine } from 'lucide-react';

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
  const event = useEventContext()
  const [activeCategory, setActiveCategory] = useState<ChatCategoryType>(
    tabs[0] ?? ChatCategoryType.EVERYONE
  );

  const { messages, isLoading, createMessage, refetch } = useMessages(
    type,
    eventId,
    activeCategory
  );
  const imageProp = event.eventLogoUrl;
  const [videoUrl, setVideoUrl] = useState<string | null>(youtubeProp ?? null);
  const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);

  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUserId) return;

      try {
        await createMessage(text, currentUserId);
        await refetch();
      } catch (err) {
        console.error('Error sending message:', err);
      }
    },
    [createMessage, currentUserId, refetch]
  );

  const sponsorMatch = useMemo(() => {
    if (!pathname) return null;
    const match = pathname.match(/^\/sponsors\/([^/]+)\/(bill|meet)(\/.*)?$/);
    return match ? { sponsorId: match[1] } : null;
  }, [pathname]);

  useEffect(() => {
    if (!eventId) return;

    const fetchSponsorVideo = async () => {
      if (!sponsorMatch?.sponsorId) return;
      setIsLoadingVideo(true);
      setVideoError(null);

      try {
        const data = await apiClient.get(
          API_ROUTES.sponsor.fetchById(eventId, sponsorMatch.sponsorId)
        );

        const youtube = data.youtubeUrl ?? data.sponsor?.youtubeUrl ?? null;

        if (youtube?.trim()) {
          setVideoUrl(youtube.trim());
        } else {
          setVideoUrl(null);
          setVideoError('Sponsor video not available');
        }
      } catch (err) {
        setVideoUrl(null);
        setVideoError('Failed to load sponsor video');
      } finally {
        setIsLoadingVideo(false);
      }
    };

    const fetchEventImage = async () => {
      if (!eventId) return;
      try {
        const url = await getEventDownloadUrl(eventId);
        if (url) {
          setImageSignedUrl(url);
        }
      } catch (error) {
        console.error('Failed to fetch event image', error);
      }
    };

    if (youtubeProp) {
      // Use video from prop
      return;
    }

    if (sponsorMatch?.sponsorId) {
      fetchSponsorVideo();
    } else {
      fetchEventImage();
    }
  }, [youtubeProp, eventId, sponsorMatch]);

  const topContent = useMemo(() => {
    if (videoUrl) {
      return (
        <div className="pt-2 pb-4 px-2 w-full">
          <YouTubeEmbed
            url={videoUrl}
            title="Sponsor Video"
            className="shadow-md border border-gray-200 rounded-lg overflow-hidden"
          />
        </div>
      );
    }

    return (
      <div className="pt-2 pb-4 px-2 w-full">
        <div className="aspect-video w-full rounded-xl shadow-md border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={imageSignedUrl || imageProp || '/placeholder.svg'}
            alt={event.title || 'Event Logo'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }, [videoUrl, imageSignedUrl, imageProp, event?.title]);

  return (
    <div className="flex flex-col h-full bg-blue-50 border-gray-200 text-gray-900 w-full overflow-hidden">
      <header className="bg-blue-50 px-4 h-14 flex items-center justify-between border-b border-blue-100">
        <h2 className="text-lg font-bold text-gray-900">{title3}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </header>

      {!videoUrl}

      <ChatTabs
        tabs={tabs}
        activeTab={activeCategory}
        onChangeTab={setActiveCategory}
      />

      {isLoadingVideo ? (
        <div className="pt-4 text-center text-gray-500 italic">Loading content...</div>
      ) : videoError ? (
        <div className="pt-4 text-center text-red-500 text-sm px-4">{videoError}</div>
      ) : (
        topContent
      )}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-blue-600" />
          <span className="text-xs text-blue-600 font-semibold">Today</span>
          <div className="h-px flex-1 bg-blue-600" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages ?? []} isLoading={isLoading} />
      </div>
      <ChatInputSection
        onSend={handleSendMessage}
        disabled={isLoading || isLoadingVideo}
      />
    </div>
  );
}
