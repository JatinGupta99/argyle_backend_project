'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useMessages';
import { chatTitles, EventId } from '@/lib/constants/api';
import { ChatTab, setChatTab } from '@/lib/slices/uiSlice.ts';
import { RootState } from '@/lib/store';
import { Message } from '@/lib/types/api';
import { ChatPanelProps } from '@/lib/types/components';
import userImage from '@/public/professional-man-in-red-shirt.jpg';
import { ArrowLeftFromLine, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageInput } from './message/MessageInput';
import { SessionCard } from './session-card';

export function ChatPanel({
  title1,
  title2,
  title3 = chatTitles.Everyone,
  eventId,
  currentUserId,
  role,
  type,
}: ChatPanelProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const isSpeaker = role === 'speaker' || role === 'organizer';
  const chatTab = useSelector((s: RootState) => s.ui.chatTab);

  const resolvedEventId = eventId ?? EventId;
  const { messages, isLoading, createMessage } = useMessages(
    type,
    resolvedEventId
  );
  const [isSending, setIsSending] = useState(false);

  /** 📨 Send message safely */
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !currentUserId) return;

      setIsSending(true);
      try {
        await createMessage(text);
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      } finally {
        setIsSending(false);
      }
    },
    [createMessage, currentUserId]
  );
  const sortedMessages = useMemo(
    () =>
      [...(messages || [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [messages]
  );

  /** 🔄 Auto-scroll on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sortedMessages]);

  /** 💬 Helper for initials */
  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-blue-50 border-r border-gray-200 text-gray-900 w-full">
      {/* 🧭 Header */}
      <header className="flex-shrink-0 bg-blue-50 border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title3}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </header>

      {/* 🗂 Tabs */}
      <div
        className={`flex gap-2 px-3 py-2 items-center bg-[#E8F4FB] ${isSpeaker ? '' : 'py-10'}`}
      >
        {[title1, title2].filter(Boolean).map((title) => {
          const chatTabValue = title as ChatTab;

          return (
            <Button
              key={title}
              onClick={() => dispatch(setChatTab(chatTabValue))}
              className={`h-8 text-xs rounded-md font-medium transition-colors flex-1 ${
                chatTab === chatTabValue
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              }`}
            >
              {title}
            </Button>
          );
        })}
      </div>

      {/* 💬 Chat Section */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Session Header */}
        <div className="pt-1 pb-4 flex-shrink-0 pl-0">
          <div className="w-[85%] transform scale-110 ml-2">
            <SessionCard
              imageSrc="/images/event_image.png"
              title="Redefining Traditional Leader"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-blue-600" />
            <span className="text-xs text-blue-600 font-semibold">Today</span>
            <div className="h-px flex-1 bg-blue-600" />
          </div>
        </div>

        {/* Messages - scrollable section ONLY */}
        <div className="flex-1 overflow-y-auto px-4 bg-blue-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : (
            <ul className="space-y-5 pb-4">
              {sortedMessages.map((m: Message, index: number) => (
                <li key={m._id ?? `msg-${index}`} className="flex gap-3">
                  {/* Avatar stays aligned beside message */}
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage
                      src={userImage.src}
                      alt="User"
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          '/professional-man-in-red-shirt.jpg';
                      }}
                    />
                    <AvatarFallback className="text-xs text-gray-900">
                      {getInitials('User')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        User
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-800 break-words">
                      {m.content}
                    </p>
                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          )}
        </div>

        {/* Input - fixed at bottom */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0 border-gray-200 bg-blue-50">
          <MessageInput
            onSend={handleSendMessage}
            disabled={isSending || isLoading}
          />
        </div>
      </div>
    </div>
  );
}
