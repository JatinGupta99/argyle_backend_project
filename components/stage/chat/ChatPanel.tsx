'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { YouTubeEmbed } from '@/components/shared/YouTubeEmbed';
import { ChatInputSection } from '@/components/stage/chat/ChatInputSection';
import { ChatMessages } from '@/components/stage/chat/ChatMessages';
import { ChatTabs } from '@/components/stage/chat/ChatTabs';
import { SessionCard } from '@/components/stage/session-card';

import { useMessages } from '@/hooks/useMessages';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatPanelProps } from '@/lib/types/components';

import { useEventContext } from '@/components/providers/EventContextProvider';
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
    if (youtubeProp || !eventId || !sponsorMatch?.sponsorId) return;

    const fetchSponsorVideo = async () => {
      setIsLoadingVideo(true);
      setVideoError(null);

      try {
        const res = await fetch(
          API_ROUTES.sponsor.fetchById(eventId, sponsorMatch.sponsorId)
        );

        if (!res.ok) throw new Error('Failed to fetch sponsor video');

        const data = await res.json();
        const youtube = data.youtubeUrl ?? data.sponsor?.youtubeUrl ?? null;

        if (youtube?.trim()) {
          setVideoUrl(youtube.trim());
        } else {
          setVideoUrl(null);
          setVideoError('Sponsor video not available');
        }
      } catch (err) {
        console.error(err);
        setVideoUrl(null);
        setVideoError('Failed to load sponsor video');
      } finally {
        setIsLoadingVideo(false);
      }
    };

    const fetchEventImage = async () => {
      if (!sponsorMatch && eventId) {
        try {
          const url = await getEventDownloadUrl(eventId);
          console.log(url, 'imageSignedUrlURL')
          if (url) setImageSignedUrl(url);
        } catch (error) {
          console.error('Failed to fetch event image', error);
        }
      }
    }

    if (sponsorMatch) {
      fetchSponsorVideo();
    } else {
      fetchEventImage();
    }
  }, [youtubeProp, eventId, sponsorMatch]);

  const topContent = useMemo(() => {
    if (videoUrl) {
      return (
        <YouTubeEmbed
          url={videoUrl}
          title="Sponsor Video"
          className="shadow-md border border-gray-200 mr-2"
        />
      );
    }
    console.log(imageSignedUrl, 'imageSignedUrl')
    return (
      <SessionCard
        imageSrc={imageSignedUrl || imageProp || undefined}
        title="Redefining Traditional Leader"
        className="mb-0"
      />
    );
  }, [videoUrl, imageSignedUrl, imageProp]);

  return (
    <div className="flex flex-col h-full bg-blue-50 border-gray-200 text-gray-900 w-full">
      <header className="bg-blue-50 px-4 h-14 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title3}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </header>
      <ChatTabs
        tabs={tabs}
        activeTab={activeCategory}
        onChangeTab={setActiveCategory}
      />
      <div className="pt-2 pb-4 pl-2 w-full">
        {isLoadingVideo ? (
          <div className="text-center text-gray-500">Loading video...</div>
        ) : videoError ? (
          <div className="text-center text-red-500">{videoError}</div>
        ) : (
          topContent
        )}
      </div>
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
