'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
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

export function ChatMessages({
  messages,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: ChatMessagesProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const prevCount = useRef(messages.length);

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

  useEffect(() => {
    // If messages were added (new messages arrived), scroll to the bottom
    if (messages.length > prevCount.current) {
      // Small timeout to ensure Virtuoso has processed the new item
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: sorted.length - 1,
          behavior: 'smooth',
          align: 'end',
        });
      }, 100);
    }
    prevCount.current = messages.length;
  }, [messages.length, sorted.length]);

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
        <Avatar className="h-10 w-10 flex-shrink-0 shadow-sm ring-2 ring-white border border-slate-100">
          <AvatarImage src={displayPicture} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-[14px] font-black bg-[#1a9ad6] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-col mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-bold text-slate-900 tracking-tight truncate max-w-[180px] sm:max-w-none">
                {displayName}
              </span>
              <span className="text-[12px] text-slate-400 font-medium shrink-0">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {isOrganizer && (
              <span className="text-[12px] font-bold text-amber-500 leading-none mt-0.5">
                (Organizer)
              </span>
            )}
          </div>
          <p className="text-[15px] text-slate-600 leading-relaxed break-words font-medium">
            {m.content}
          </p>
        </div>
      </div>
    );
  };

  const showScrollButton = false; // Placeholder for future scroll-to-bottom button

  return (
    <Virtuoso
      ref={virtuosoRef}
      style={{ height: '100%', width: '100%' }}
      data={sorted}
      initialTopMostItemIndex={Math.max(0, sorted.length - 1)}
      increaseViewportBy={200}
      atBottomThreshold={100}
      alignToBottom={true}
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
}
