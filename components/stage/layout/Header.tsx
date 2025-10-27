'use client';

import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
  notificationCount?: number;
}

export function Header({ title = '', notificationCount = 5 }: HeaderProps) {
  return (
    <header className=" sticky top-0 z-10 h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left: Title */}
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative flex items-center justify-center p-1 rounded-full hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-700" />

          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-xs font-medium text-white bg-green-600 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <Avatar className="h-7 w-7 border border-border">
          <AvatarImage src="/attendee-avatar.jpg" alt="User" />
          <AvatarFallback>NB</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
