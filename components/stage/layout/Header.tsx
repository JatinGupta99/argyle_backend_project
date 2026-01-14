'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { cn } from '@/lib/utils';

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
    <div className={cn(
      "sticky top-0 z-10 border-b shadow-sm mb-3",
      title === 'Speaker Live Stage' ? "bg-[#000a28] border-white/10" : "bg-background border-border"
    )}>
      <div className="flex h-16 items-center justify-between px-8 md:px-12 w-full">
        <h1 className={cn(
          "text-lg font-bold truncate",
          title === 'Speaker Live Stage' ? "text-white" : "text-[#000000]"
        )}>{title}</h1>

        <div className="flex items-center gap-3">
          <span className={cn(
            "text-sm font-bold hidden md:inline-block",
            title === 'Speaker Live Stage' ? "text-slate-300" : "text-[#000000]"
          )}>
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
