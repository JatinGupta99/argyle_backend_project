'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { Message } from '@/lib/types/api';
import userImage from '@/public/professional-man-in-red-shirt.jpg';
import { RoleView } from '@/lib/slices/uiSlice';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [messages]
  );

  useEffect(() => {
    if (sorted.length > 0) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sorted]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin text-blue-600" size={24} />
      </div>
    );
  }

  return (
    <ul className="space-y-6 px-4 pb-4">
      {sorted.map((m, index) => {
        const userData = (m as any).userId || (m as any).user;
        const displayName = userData?.name || userData?.username || 'Guest User';
        const displayPicture = userData?.pictureUrl || userData?.avatar || '';
        const userRole = userData?.role || 'Attendee';
        const isOrganizer = userRole === RoleView.Moderator;
        const initials = getInitials(displayName);

        return (
          <li key={m._id ?? `msg-${index}`} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
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
          </li>
        );
      })}
      <div ref={endRef} />
    </ul>
  );
}
