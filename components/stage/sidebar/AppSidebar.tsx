'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-context';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { getTokenPayload } from '@/lib/utils/jwt-utils';

export function AppSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const { role, token } = useAuth();

  const eventId = params?.eventId as string;
  const paramInviteId = params?.inviteId as string;

  // Recover inviteId from token if not in params (e.g. when on Update/Info pages)
  const tokenPayload = getTokenPayload<{ inviteId?: string }>(token || '');
  const effectiveInviteId = paramInviteId || tokenPayload?.inviteId;

  // Dynamic Strict Navigation based on Role
  let stagePath = `/dashboard/events/${eventId}/attendees`; // Default for Attendees

  if (role === ROLES_ADMIN.Moderator || ROLES_ADMIN.Speaker) {
    stagePath = `/dashboard/events/${eventId}/speakers/${effectiveInviteId}`;
  }

  const lobbySubItems = [
    { label: 'Updates', path: `/dashboard/events/${eventId}/update` },
    { label: 'Agenda', path: `/dashboard/events/${eventId}/agenda` },
    { label: 'Info', path: `/dashboard/events/${eventId}/info` },
  ];

  const [openLobby, setOpenLobby] = useState(() =>
    lobbySubItems.some(item => pathname === item.path)
  );

  return (
    <Sidebar className="w-72 bg-[#000a28] border-r border-white/5 shadow-2xl overflow-hidden group/sidebar">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_50%)] z-0 pointer-events-none" />

      {/* Header */}
      <SidebarHeader className="h-auto px-8 py-10 bg-transparent border-none relative z-10 overflow-hidden">
        <Link href="/dashboard" className="block transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/argyle-logo.png"
            alt="Argyle"
            width={140}
            height={44}
            className="object-contain brightness-0 invert"
          />
        </Link>
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent className="px-4 pb-6 bg-transparent relative z-10 custom-scrollbar">
        <SidebarMenu className="gap-2.5">
          {/* Lobby Section */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLobby((prev) => !prev)}
              className={cn(
                'flex items-center gap-4 px-6 py-4 h-14 rounded-[1.25rem] font-bold transition-all duration-300 group select-none relative overflow-hidden',
                openLobby ? 'bg-white/10 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="text-[15px] text-white">Lobby</span>
              <ChevronDown
                className={cn(
                  'transition-transform ml-auto duration-300',
                  openLobby ? 'rotate-180 text-[#71cdfa]' : 'rotate-0 text-slate-500 group-hover:text-slate-300'
                )}
                strokeWidth={3}
                size={16}
              />
            </SidebarMenuButton>

            <AnimatePresence mode="wait">
              {openLobby && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="mt-1.5 flex flex-col gap-1.5 px-3"
                >
                  <ul className="space-y-1 py-1 border-l border-white/10 ml-6 pl-4">
                    {lobbySubItems.map((sub) => {
                      const isActive = pathname === sub.path;
                      return (
                        <li key={sub.label}>
                          <Link
                            href={sub.path}
                            className={cn(
                              'block w-full text-left py-2.5 text-[14px] font-semibold transition-all rounded-xl relative group/item',
                              isActive
                                ? 'text-[#71cdfa]'
                                : 'text-slate-500 hover:text-slate-200'
                            )}
                          >
                            <span className="relative z-10">{sub.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeHighlight"
                                className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#71cdfa] shadow-[0_0_8px_rgba(113,205,250,0.6)]"
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarMenuItem>

          {/* Minimalist Separator */}
          <div className="my-3 mx-6 h-px bg-blue-900/40 lg:my-4" />

          {/* Stage */}
          <SidebarMenuItem>
            <Link
              href={stagePath}
              className={cn(
                'flex items-center gap-4 px-6 py-4 h-14 rounded-[1.25rem] font-bold transition-all group relative overflow-hidden',
                pathname.includes('/speakers/') || pathname.includes('/attendees')
                  ? 'bg-gradient-to-br from-[#71cdfa] to-[#1c97d4] text-[#000a28] shadow-[0_8px_25px_-5px_rgba(113,205,250,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="text-[15px] tracking-tight">Main Stage</span>

              {!(pathname.includes('/speakers/') || pathname.includes('/attendees')) && (
                <div className="ml-auto flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 10, 4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        className="w-0.5 bg-rose-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </Link>
          </SidebarMenuItem>

          {/* Sponsors */}
          <SidebarMenuItem>
            <Link
              href={`/dashboard/events/${eventId}/sponsors`}
              className={cn(
                'flex items-center gap-4 px-6 py-4 h-14 rounded-[1.25rem] font-bold transition-all group relative',
                pathname.includes('/sponsors')
                  ? 'bg-white/10 text-[#71cdfa] border border-white/5 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="text-[15px] tracking-tight">Sponsors</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-8 py-8 bg-transparent border-t border-white/5 relative z-10">
        <div className="flex flex-col gap-5">
          <p className="text-[9px] text-slate-500 font-semibold tracking-wide">
            © {new Date().getFullYear()} ARGYLE
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
