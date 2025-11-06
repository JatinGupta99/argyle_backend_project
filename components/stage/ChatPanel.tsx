'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftFromLine, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MessageInput } from './MessageInput';
import { SessionCard } from './SessionCard';
import { useMessages } from '@/hooks/use-messages';
import { RoleView, setChatTab } from '@/lib/slices/uiSlice.ts';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { ChatType } from '@/lib/constants/chat';

type ChatPanelProps = {
  title1?: string;
  title2?: string;
  title3?: string;
  currentUserId?: string;
  role: RoleView;
  type: ChatType;
};

export function ChatPanel({
  title1,
  title2,
  title3,
  role,
  type,
  currentUserId,
}: ChatPanelProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isSpeaker = role === 'speaker' || role === 'organizer';

  const { messages, isLoading, createMessage } = useMessages(type);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const tab = useSelector((s: RootState) => s.ui.chatTab);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsSending(true);
    try {
      await createMessage(text);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    console.log(messages,'snclsdnlsd')
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-blue-50 border-r border-gray-200 text-gray-900 w-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-blue-50 border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black-900">{title3}</h2>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      </div>

      {/* Chat Tabs */}
      {isSpeaker ? (
        <div className="flex gap-2 px-2.5 py-2 items-center bg-[#E8F4FB]">
          {title1 && (
            <Button
              className={`${
                tab === title1
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              } w-[129px] h-[33px] text-xs rounded-[4px] flex items-center justify-center`}
              onClick={() => dispatch(setChatTab(title1))}
            >
              {title1}
            </Button>
          )}
          {title2 && (
            <Button
              className={`${
                tab === title2
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              } w-[120px] h-[33px] text-xs rounded-[4px] flex items-center justify-center`}
              onClick={() => dispatch(setChatTab(title2))}
            >
              {title2}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex gap-2 pl-4 pr-6 py-10 items-center bg-[#E8F4FB]">
          {title1 && (
            <Button
              className={`w-full h-8 text-xs rounded-md font-medium transition-colors ${
                tab === title1
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              }`}
              onClick={() => dispatch(setChatTab(title1))}
            >
              {title1}
            </Button>
          )}
        </div>
      )}

      {/* Chat Content */}
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

        {/* Messages */}
        <div className="flex-1 overflow-hidden px-4 rounded-lg bg-blue-50">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : (
              <div className="pb-4">
                <ul className="space-y-5">
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
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Message Input */}
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
