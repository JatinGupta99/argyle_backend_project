'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-6 mb-3 border-b border-gray-200 shadow-sm pb-1">
      <h1 className="text-lg font-semibold text-gray-800 truncate">{title}</h1>

      <div className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/attendee-avatar.jpg" alt="User avatar" />
          <AvatarFallback>NB</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
