'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Message } from '@/lib/types/api';
import { RoleView } from '@/lib/slices/uiSlice';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export interface ChatMessagesRef {
  scrollToBottom: () => void;
}

export const ChatMessages = forwardRef<ChatMessagesRef, ChatMessagesProps>(({
  messages,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}, ref) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const prevCount = useRef(messages.length);
  const [atBottom, setAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false); // Can be used for "New Messages" indicator later

  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          if (isNaN(timeA) || isNaN(timeB)) return 0;
          return timeA - timeB;
        }
      ),
    [messages]
  );

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      // Force scroll to bottom immediately (for user sent messages)
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: sorted.length - 1,
          behavior: 'smooth',
          align: 'end',
        });
      }, 50);
    }
  }));

  useEffect(() => {
    // If messages were added
    if (messages.length > prevCount.current) {
      // Only auto-scroll if user was already at the bottom
      if (atBottom) {
        setTimeout(() => {
          virtuosoRef.current?.scrollToIndex({
            index: sorted.length - 1,
            behavior: 'smooth',
            align: 'end',
          });
        }, 100);
      } else {
        // Here we could show a "New messages below" toast
        setShowScrollButton(true);
      }
    }
    prevCount.current = messages.length;
  }, [messages.length, sorted.length, atBottom]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      ?.split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (isLoading && !isFetchingNextPage) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin text-blue-600" size={24} />
      </div>
    );
  }

  const renderMessage = (index: number) => {
    const m = sorted[index];
    if (!m) return null;

    const userData = (m as any).userId || (m as any).user;

    // Robustly extract name
    let displayName = 'Guest User';
    if (userData && typeof userData === 'object') {
      displayName = userData.name || userData.username || userData.displayName || 'Guest User';
    } else if (typeof userData === 'string') {
      // rare case if just an ID came back
      displayName = 'Guest User';
    }

    const displayPicture = (userData && typeof userData === 'object') ? (userData.pictureUrl || userData.avatar || '') : '';
    const userRole = (userData && typeof userData === 'object' ? userData.role : null) || 'Attendee';
    const isOrganizer = userRole === RoleView.Moderator;
    const initials = getInitials(displayName);

    return (
      <div className="flex gap-3 mb-6 pr-4 animate-in fade-in slide-in-from-left-2 duration-300">
        <Avatar className="h-10 w-10 flex-shrink-0 shadow-sm ring-2 ring-background border border-border">
          <AvatarImage src={displayPicture} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-[14px] font-black bg-accent text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-col mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-bold text-[#000000] tracking-tight truncate max-w-[180px] sm:max-w-none">
                {displayName}
              </span>
              <span className="text-[12px] text-muted-foreground/60 font-medium shrink-0">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {isOrganizer && (
              <span className="text-[12px] font-bold text-warning leading-none mt-0.5">
                (Organizer)
              </span>
            )}
          </div>
          <p className="text-[15px] text-[#000000] leading-relaxed break-words font-normal">
            {m.content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Virtuoso
      ref={virtuosoRef}
      style={{ height: '100%', width: '100%' }}
      data={sorted}
      initialTopMostItemIndex={Math.max(0, sorted.length - 1)}
      increaseViewportBy={200}
      atBottomThreshold={100}
      alignToBottom={true} // Consider removing if deprecated, but keeping for safety as per original
      atBottomStateChange={(isAtBottom) => {
        setAtBottom(isAtBottom);
        if (isAtBottom) setShowScrollButton(false);
      }}
      computeItemKey={(index, item) => item._id || index}
      startReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage?.();
        }
      }}
      itemContent={(index, item) => renderMessage(index)}
      components={{
        Header: () => (
          isFetchingNextPage ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-blue-300" size={20} />
            </div>
          ) : null
        ),
      }}
    />
  );
});

ChatMessages.displayName = 'ChatMessages';
