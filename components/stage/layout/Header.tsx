'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  const user = useSelector((state: RootState) => state.user);
  console.log('Header Rendered. Title:', title, 'User:', user);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm mb-3">
      <div className="flex h-16 items-center justify-between px-8 md:px-12 w-full">
        <h1 className="text-lg font-semibold text-gray-800 truncate">{title}</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 hidden md:inline-block">
            {user?.name || 'Guest'}
          </span>
          <Avatar className="h-9 w-9 ring-2 ring-slate-100 cursor-pointer hover:ring-slate-200 transition-all">
            <AvatarImage src={user?.email === 'demo@argyle.com' ? '/attendee-avatar.jpg' : ''} alt={user?.name || "User avatar"} />
            <AvatarFallback className="bg-sky-100 text-sky-700 font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
