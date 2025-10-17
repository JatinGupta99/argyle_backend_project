'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { setChatTab } from '@/lib/slices/ui-slice';
import { addMessage } from '@/lib/slices/chat-slice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SessionCard } from './session-card';
import { MessageInput } from './message-input';
import { useEffect, useRef } from 'react';

export function ChatPanel() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tab = useSelector((s: RootState) => s.ui.chatTab);
  const messages = useSelector((s: RootState) => s.chat.messages);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  return (
    <div className="flex h-screen flex-col w-80 bg-[#E8F4FB] fixed left-48 top-0 z-10">
  {/* Fixed Header with Tabs */}
  <div className="flex-shrink-0">
  <div className="h-14 flex items-center justify-between px-4 border-b bg-background">
        <div className="flex items-center gap-50">
          <h2 className="text-sm font-semibold">Everyone</h2>
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m9 6-6 6 6 6" />
              <path d="M3 12h14" />
              <path d="M21 19V5" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="relative h-5 w-5 rounded bg-muted" />
          <Avatar className="h-7 w-7">
            <AvatarImage src="/attendee-avatar.jpg" alt="User" />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
        </div>
      </div>
    {/* Tabs */}
    <div className="flex gap-2 px-20 py-2 item-center bg-[#E8F4FB]">
      <Button
        className={
          tab === 'everyone'
            ? 'bg-[#1C96D3] text-white px-3 py-1 text-xs h-7'
            : 'px-3 py-1 text-xs h-7'
        }
        onClick={() => dispatch(setChatTab('everyone'))}
      >
        Everyone
      </Button>
      <Button
        className={
          tab === 'backstage'
            ? 'bg-[#1C96D3]/60 text-white hover:bg-[#1C96D3]/70 px-3 py-1 text-xs h-7'
            : 'px-3 py-1 text-xs h-7'
        }
        variant="ghost"
        onClick={() => dispatch(setChatTab('backstage'))}
      >
        Backstage
      </Button>
    </div>
  </div>

  {/* Scrollable Chat Content */}
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
        <span className="text-xs text-muted-foreground">Today</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-hidden px-4">
      <ScrollArea className="h-full">
        <ul className="space-y-5 pb-4">
          {messages.map((m) => (
            <li key={m.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-profile-avatars.png" alt={m.author} />
                <AvatarFallback className="text-[10px]">{initials(m.author)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{m.author}</span>
                  {m.role === 'organizer' && (
                    <span className="text-[10px] text-primary">Organizer</span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{m.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-pretty">{m.text}</p>
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
    <div className="px-4 pb-4 pt-2 flex-shrink-0">
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

// Helper function for avatar initials
function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
