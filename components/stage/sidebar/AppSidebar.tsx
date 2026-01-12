'use client';

import Link from 'next/link';
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

export function AppSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const eventId = params?.eventId as string;
  const inviteId = params?.inviteId as string;

  // Professional dynamic routing:
  // If we have an inviteId (Speakers/Moderators), redirect to the specific stage
  const stagePath = inviteId
    ? `/dashboard/events/${eventId}/speakers/${inviteId}`
    : `/dashboard/events/${eventId}/attendees`;

  const lobbySubItems = [
    { label: 'Updates', path: `/dashboard/events/${eventId}/update` },
    { label: 'Agenda', path: `/dashboard/events/${eventId}/agenda` },
    { label: 'Info', path: `/dashboard/events/${eventId}/info` },
  ];

  const [openLobby, setOpenLobby] = useState(() =>
    lobbySubItems.some(item => pathname === item.path)
  );

  return (
    <Sidebar className="w-64 border-r border-slate-100 bg-white">
      {/* Header */}
      <SidebarHeader className="h-auto flex items-center px-6 py-8 bg-white border-none">
        <Image
          src="/argyle-logo.png"
          alt="Argyle"
          width={130}
          height={40}
          className="object-contain w-32 h-auto"
        />
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent className="p-0 bg-white">
        <SidebarMenu className="gap-0">
          {/* Lobby dropdown */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLobby((prev) => !prev)}
              className={cn(
                'flex items-center gap-3 px-6 py-4 h-auto rounded-none font-bold transition-all duration-200 group relative w-full hover:bg-transparent',
                'text-slate-900'
              )}
            >
              <span className="text-[16px]">Lobby</span>
              <ChevronDown
                className={cn(
                  'transition-transform ml-auto text-slate-900',
                  openLobby ? 'rotate-180' : 'rotate-0'
                )}
                strokeWidth={2.5}
                size={16}
              />
            </SidebarMenuButton>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                openLobby ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <ul className="space-y-0 bg-[#F0F9FF]">
                {lobbySubItems.map((sub) => {
                  const isActive = pathname === sub.path;
                  return (
                    <li key={sub.label}>
                      <Link
                        href={sub.path}
                        className={cn(
                          'block w-full text-left pl-10 pr-6 py-3 text-[15px] font-medium transition-all relative',
                          isActive
                            ? 'bg-[#1da1f2] text-white hover:bg-[#1a91da]'
                            : 'text-slate-600 hover:text-[#1da1f2] hover:bg-sky-50/50'
                        )}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </SidebarMenuItem>

          {/* Stage */}
          <SidebarMenuItem>
            <Link
              href={stagePath}
              className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-none font-bold transition-all w-full',
                pathname === stagePath
                  ? 'bg-[#1da1f2] text-white hover:bg-[#1a91da]'
                  : 'text-slate-900 hover:bg-sky-50/30 hover:text-[#1da1f2]'
              )}
            >
              <span className="text-[16px]">Stage</span>
            </Link>
          </SidebarMenuItem>

          {/* Pre-recorded (On Hold)
          <SidebarMenuItem>
            <Link
              href={`/dashboard/events/${eventId}/pre-recorded`}
               className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-none font-bold transition-all w-full',
                pathname === `/dashboard/events/${eventId}/pre-recorded`
                  ? 'bg-[#1da1f2] text-white hover:bg-[#1a91da]'
                  : 'text-slate-900 hover:bg-sky-50/30 hover:text-[#1da1f2]'
              )}
            >
              <span className="text-[16px]">Pre-recorded</span>
            </Link>
          </SidebarMenuItem>
          */}

          {/* Sponsor */}
          <SidebarMenuItem>
            <Link
              href={`/dashboard/events/${eventId}/sponsors`}
              className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-none font-bold transition-all w-full',
                pathname === `/dashboard/events/${eventId}/sponsors`
                  ? 'bg-[#1da1f2] text-white hover:bg-[#1a91da]'
                  : 'text-slate-900 hover:bg-sky-50/30 hover:text-[#1da1f2]'
              )}
            >
              <span className="text-[16px]">Sponsor</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="items-center text-[10px] text-slate-300 px-6 py-6 font-bold uppercase tracking-widest bg-white border-none mt-auto">
        © {new Date().getFullYear()} Argyle
      </SidebarFooter>
    </Sidebar>
  );
}
