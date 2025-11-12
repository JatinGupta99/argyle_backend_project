'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { Message } from '@/lib/types/api';
import userImage from '@/public/professional-man-in-red-shirt.jpg';

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

  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin text-blue-600" size={24} />
      </div>
    );
  }

  return (
    <ul className="space-y-5 pb-4 px-4 bg-blue-50 h-full w-full">
      {sorted.map((m, index) => (
        <li key={m._id ?? `msg-${index}`} className="flex gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={userImage.src} alt="User" />
            <AvatarFallback className="text-xs text-gray-900">
              {getInitials('User')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-900">User</span>
              <span className="text-xs text-gray-500">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed break-words">
              {m.content}
            </p>
          </div>
        </li>
      ))}
      <div ref={endRef} />
    </ul>
  );
}
