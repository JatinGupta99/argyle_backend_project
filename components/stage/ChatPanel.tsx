'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setChatTab } from '@/lib/slices/uiSlice.ts';
import { addMessage } from '@/lib/slices/chat-slice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SessionCard } from './SessionCard';
import { MessageInput } from './MessageInput';
import { useEffect, useRef } from 'react';

type ChatPanelProps = {
  role?: 'attendee' | 'speaker' | 'organizer';
};

export function ChatPanel({ role = 'attendee' }: ChatPanelProps) {
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
    <div
      className="flex flex-col h-full bg-[#E8F4FB] border-r text-gray-900"
      style={{ width: '280px' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-[#E8F4FB] border-gray-300">
        <div className="flex items-center px-4 h-14 justify-between">
          <h2 className="text-sm font-semibold">Everyone</h2>
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Tabs */}
        {isSpeaker ? (
          <div className="flex gap-2 px-4 py-2 items-center bg-[#E8F4FB]">
            <Button
              className={`${
                tab === 'everyone'
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              } w-[129px] h-[33px] text-xs rounded-[4px] flex items-center justify-center`}
              onClick={() => dispatch(setChatTab('everyone'))}
            >
              Everyone
            </Button>

            <Button
              className={`${
                tab === 'backstage'
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              } w-[120px] h-[33px] text-xs rounded-[4px] flex items-center justify-center`}
              onClick={() => dispatch(setChatTab('backstage'))}
            >
              Backstage
            </Button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-[#E8F4FB]">
            <Button
              className={`w-full h-8 text-xs rounded-md font-medium transition-colors ${
                tab === 'everyone'
                  ? 'bg-[#1C96D3] text-white'
                  : 'bg-[#D1DEE5] text-gray-900 hover:bg-[#c3d5df]'
              }`}
              onClick={() => dispatch(setChatTab('everyone'))}
            >
              Everyone
            </Button>
          </div>
        )}
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Session Card */}
        <div className="px-4 pt-4 flex-shrink-0">
          <SessionCard
            imageSrc="/images/speaker.png"
            title="Redefining Traditional Leader"
          />
        </div>

        {/* Timeline */}
        <div className="px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Today</span>
            <div className="h-px flex-1 bg-gray-300" />
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
                        <span className="text-[10px] text-primary">
                          Organizer
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
                  role: role,
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
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
