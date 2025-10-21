'use client';

import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left: Title */}
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative flex items-center justify-center p-1 rounded-full hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-blue-500 rounded-full" />
        </button>

        <Avatar className="h-7 w-7 border border-border">
          <AvatarImage src="/attendee-avatar.jpg" alt="User" />
          <AvatarFallback>NB</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
