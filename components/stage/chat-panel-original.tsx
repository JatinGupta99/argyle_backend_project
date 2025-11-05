'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addMessage } from '@/lib/slices/chat-slice';
import {
  setChatTab,
  type ChatTab,
  type StageView,
  type RoleView,
} from '@/lib/slices/uiSlice.ts';
import type { RootState } from '@/lib/store';
import { ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageInput } from './MessageInput';
import { SessionCard } from './SessionCard';

type ChatPanelProps = {
  role?: RoleView;
  title1?: ChatTab | StageView;
  title2?: ChatTab | StageView;
  title3: string;
};

export function ChatPanel({
  role = 'attendee',
  title1,
  title2,
  title3,
}: ChatPanelProps) {
  const isSpeaker = role === 'speaker' || role === 'organizer';
  const router = useRouter();
  const dispatch = useDispatch();
  const tab = useSelector((s: RootState) => s.ui.chatTab);
  const messages = useSelector((s: RootState) => s.chat.messages);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#E8F4FB] border-r text-gray-900 w-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-[#E8F4FB] border-gray-300">
        <div className="flex items-center px-4 h-14 justify-between">
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '18px',
              lineHeight: '22px', // good readable line height
              letterSpacing: '0px', // no extra spacing
            }}
          >
            {title3}
          </h2>
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ArrowLeftFromLine />
          </button>
        </div>

        {/* Tabs */}
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
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Session Card */}
        <div className="px-4 pt-4 flex-shrink-0">
          <SessionCard
            imageSrc="/images/virtual_event.webp"
            title="Redefining Traditional Leader"
          />
        </div>

        {/* Timeline */}
        <div className="px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-blue-600" />
            <span className="text-xs text-blue-600 font-semibold">Today</span>
            <div className="h-px flex-1 bg-blue-600" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden px-4 rounded-lg bg-[#E8F4FB] shadow-inner">
          <ScrollArea className="h-full">
            <ul className="space-y-5 pb-4">
              {messages.map((m) => (
                <li key={m.id} className="flex gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src="/diverse-profile-avatars.png"
                      alt={m.author}
                    />
                    <AvatarFallback className="text-[10px] text-gray-900">
                      {initials(m.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {m.author}
                      </span>
                      {m.role === 'organizer' && (
                        <span
                          className="text-[14px] font-semibold"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: '125%',
                            letterSpacing: '0%',
                            color: '#EE9F15',
                          }}
                        >
                          (Organizer)
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        {m.timestamp}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-800">
                      {m.text}
                    </p>
                  </div>
                </li>
              ))}
              <li aria-hidden="true">
                <div ref={endRef} />
              </li>
            </ul>
          </ScrollArea>
        </div>

        {/* Composer */}
        <div className="px-4 pt-9 pb-2 flex-shrink-0">
          <MessageInput
            onSend={(text) =>
              dispatch(
                addMessage({
                  author: 'You',
                  role: 'attendee',
                  text,
                })
              )
            }
          />
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
