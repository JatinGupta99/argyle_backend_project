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
      "sticky top-0 z-10 border-b backdrop-blur-md transition-all duration-300",
      title === 'Speaker Live Stage'
        ? "bg-[#000a28]/80 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
        : "bg-white/80 border-slate-200/60 shadow-sm"
    )}>
      <div className="flex h-20 items-center justify-between px-8 md:px-12 w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col">
          <h1 className={cn(
            "text-xl font-black tracking-tight",
            title === 'Speaker Live Stage' ? "text-white" : "text-[#000a28]"
          )}>{title}</h1>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              title === 'Speaker Live Stage' ? "bg-red-500 animate-pulse" : "bg-emerald-500"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {title === 'Speaker Live Stage' ? 'Live Transmission' : 'Secure Portal'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-sm font-black tracking-tight",
              title === 'Speaker Live Stage' ? "text-white" : "text-[#000a28]"
            )}>
              {""}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {user?.email || ''}
            </span>
          </div>
          <Avatar className="h-11 w-11 ring-2 ring-white/10 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all">
            <AvatarImage src={user?.email === 'demo@argyle.com' ? '/attendee-avatar.jpg' : ''} alt={user?.name || "User avatar"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
