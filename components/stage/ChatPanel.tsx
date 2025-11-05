'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftFromLine, Loader2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageInput } from './message/MessageInput';
import { SessionCard } from './session-card';

import {
  setChatTab,
  type ChatTab,
  type RoleView,
} from '@/lib/slices/uiSlice.ts';
import type { RootState } from '@/lib/store';
import { useMessages } from '@/hooks/useMessages';
import { EventId } from '@/lib/constants/api';

// ===== Types =====
interface ChatPanelProps {
  title1?: ChatTab;
  title2?: ChatTab;
  title3?: ChatTab;
  eventId?: string;
  currentUserId?: string;
  role?: RoleView;
}

// ===== Utility =====
const initials = (name: string) =>
  name
    ?.split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '';

export function ChatPanel({
  title1,
  title2,
  title3,
  eventId,
  role,
  currentUserId = '68e630972af1374ec4c36630',
}: ChatPanelProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const tab = useSelector((s: RootState) => s.ui.chatTab);

  const isSpeaker = role === 'speaker' || role === 'organizer';
  const { messages = [], isLoading, createMessage } = useMessages(EventId);

  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ===== Handlers =====
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setIsSending(true);
      try {
        await createMessage(currentUserId, text);
      } catch (err) {
        console.error('❌ Failed to send message:', err);
      } finally {
        setIsSending(false);
      }
    },
    [createMessage, currentUserId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  const sortedMessages = useMemo(() => {
    const safeMessages = Array.isArray(messages) ? [...messages] : [];
    return safeMessages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  const renderTabButton = useCallback(
    (title?: ChatTab, width = 'w-[129px]') =>
      title ? (
        <Button
          key={title}
          className={`${width} h-[33px] text-xs rounded-[4px] ${
            tab === title
              ? 'bg-[#1C96D3] text-white'
              : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
          }`}
          onClick={() => dispatch(setChatTab(title))}
        >
          {title}
        </Button>
      ) : null,
    [tab, dispatch]
  );

  return (
    <div className="flex flex-col h-full border-r  text-black-600 bg-[#E8F4FB] ">
      {/* ===== Header ===== */}
      <header className="flex-shrink-0 border border-gray-200 px-4 h-14 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black-900">{title3}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </header>

      {/* ===== Tabs ===== */}
      <div
        className={`flex items-center justify-around px-2.5 py-2 ${
          isSpeaker ? '' : 'pl-4 pr-6 py-10'
        }`}
      >
        {renderTabButton(title1)}
        {isSpeaker && renderTabButton(title2, 'w-[120px]')}
      </div>

      {/* ===== Chat Content ===== */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <section className="ml-1.5 pr-4 pt-2 pb-1 flex-shrink-0 w-full">
          <SessionCard
            imageSrc="/images/event_image.png"
            title="Redefining Traditional Leader"
          />
        </section>

        {/* Divider */}
        <div className="px-4 py-2 flex-shrink-0 flex items-center gap-2  ">
          <div className="h-px flex-1 bg-blue-600" />
          <span className="text-xs text-blue-600 font-semibold">Today</span>
          <div className="h-px flex-1 bg-blue-600" />
        </div>

        {/* ===== Messages ===== */}
        <div className="flex-1 overflow-hidden px-4 rounded-lg bg-[#E8F4FB] ">
          <ScrollArea className="h-full" aria-live="polite">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : (
              <ul className="space-y-5 pb-4">
                {sortedMessages.map((m) => (
                  <li key={m._id} className="flex gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage
                        src="/professional-man-in-red-shirt.jpg"
                        alt="User Avatar"
                        onError={(e) =>
                          (e.currentTarget.src =
                            '/professional-man-in-red-shirt.jpg')
                        }
                      />
                      <AvatarFallback className="text-xs text-gray-900">
                        {initials('U')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          Jatin {/* 🔹 Hardcoded username */}
                        </span>
                        <time
                          className="text-xs text-gray-500"
                          dateTime={m.createdAt}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
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
          </ScrollArea>
        </div>

        {/* ===== Message Input ===== */}
        <footer className="px-4 pt-4 pb-2 flex-shrink-0">
          <MessageInput onSend={handleSendMessage} disabled={isSending} />
        </footer>
      </main>
    </div>
  );
}
