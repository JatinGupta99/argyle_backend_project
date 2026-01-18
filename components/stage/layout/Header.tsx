'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/app/auth/auth-context';
import { extractNameFromToken, extractEmailFromToken } from '@/lib/utils/jwt-utils';
import { cn } from '@/lib/utils';
import { useStageContext } from '@/components/providers/StageContext';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  const { token } = useAuth();
  const { isBroadcastLive } = useStageContext();

  const userName = token ? extractNameFromToken(token) : null;
  const userEmail = token ? extractEmailFromToken(token) : null;

  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className={cn(
      "sticky top-0 z-10 border-b backdrop-blur-md transition-all duration-300",
      (title.includes('Speaker') || title.includes('Moderator'))
        ? "bg-[#000a28]/80 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
        : "bg-white/80 border-slate-200/60 shadow-sm"
    )}>
      <div className="flex h-20 items-center justify-between px-8 md:px-12 w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col">
          <h1 className={cn(
            "text-xl font-black tracking-tight",
            (title.includes('Speaker') || title.includes('Moderator')) ? "text-white" : "text-[#000a28]"
          )}>{title}</h1>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isBroadcastLive ? "bg-red-500 animate-pulse" : "bg-emerald-500"
            )} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-11 w-11 ring-2 ring-white/10 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all">
                <AvatarImage src={userEmail === 'demo@argyle.com' ? '/attendee-avatar.jpg' : ''} alt={userName || "User avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700 px-4 py-3">
              <div className="flex flex-col gap-1">
                <p className="font-bold text-sm">{userName || 'User'}</p>
                <p className="text-xs text-slate-300">{userEmail || 'No email'}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
