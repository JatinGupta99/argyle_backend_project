'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftFromLine, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MessageInput } from './MessageInput';
import { SessionCard } from './SessionCard';
import { useMessages } from '@/hooks/use-messages';

type ChatPanelProps = {
  title?: string;
  currentUserId?: string;
};

export function ChatPanel({
  title = 'Chat with Argyle here',
  currentUserId = '68e630972af1374ec4c36630',
}: ChatPanelProps) {
  const router = useRouter();
  const { messages, isLoading, createMessage } = useMessages();
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsSending(true);
    try {
      await createMessage(currentUserId, text);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-blue-50 border-r border-gray-200 text-gray-900 w-full">
      <div className="flex-shrink-0 bg-blue-50 border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <div className="px-4 pt-4 flex-shrink-0">
          <SessionCard
            imageSrc="/images/event_image.png"
            title="Redefining Traditional Leader"
          />
        </div>

        <div className="px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-blue-600" />
            <span className="text-xs text-blue-600 font-semibold">Today</span>
            <div className="h-px flex-1 bg-blue-600" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-4 rounded-lg bg-blue-50">
          <ScrollArea ref={scrollRef} className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : (
              <ul className="space-y-5 pb-4">
                {messages
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((m) => (
                    <li key={m._id} className="flex gap-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage
                          src="/professional-man-in-red-shirt.jpg"
                          alt="User"
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
                            Jatin
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(m.createdAt).toLocaleTimeString()}
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
          </ScrollArea>
        </div>

        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <MessageInput onSend={handleSendMessage} disabled={isSending} />
        </div>
      </div>
    </div>
  );
}

function initials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
