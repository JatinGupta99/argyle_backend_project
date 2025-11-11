'use client';

import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  return (
    <header className=" sticky top-0 z-10 h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      {/* Left: Title */}
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="h-7 w-7 border border-border">
          <AvatarImage src="/attendee-avatar.jpg" alt="User" />
          <AvatarFallback>NB</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
