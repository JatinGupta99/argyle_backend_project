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
  const [openLobby, setOpenLobby] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const eventId = params?.eventId as string;
  const inviteId = params?.inviteId as string;
  const stagePath = inviteId
    ? `/dashboard/events/${eventId}/speakers/${inviteId}`
    : `/dashboard/events/${eventId}/attendees`;

  const lobbySubItems = [
    { label: 'Updates', path: `/dashboard/events/${eventId}/update` },
    { label: 'Agenda', path: `/dashboard/events/${eventId}/agenda` },
    { label: 'Info', path: `/dashboard/events/${eventId}/info` },
  ];

  return (
    <Sidebar className="w-64 border-r border-slate-100 bg-white">
      {}
      <SidebarHeader className="h-20 flex items-center px-6 bg-white border-none">
        <Image
          src="/argyle-logo.png"
          alt="Argyle"
          width={130}
          height={40}
          className="object-contain w-32 h-auto"
        />
      </SidebarHeader>

      {}
      <SidebarContent className="p-0 bg-white">
        <SidebarMenu className="px-3 gap-1">
          {}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLobby((prev) => !prev)}
              className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-none font-bold transition-all duration-300 group relative w-full',
                'text-sky-600 hover:bg-sky-50/50'
              )}
            >
              <span className="text-[17px]">Lobby</span>
              <ChevronDown
                className={cn(
                  'transition-transform ml-auto text-sky-400 group-hover:text-sky-600',
                  openLobby ? 'rotate-180' : 'rotate-0'
                )}
                size={20}
              />
            </SidebarMenuButton>

            <div
              className={cn(
                'overflow-hidden transition-all duration-500 ease-in-out',
                openLobby ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <ul className="space-y-0">
                {lobbySubItems.map((sub) => (
                  <li key={sub.label}>
                    <Link
                      href={sub.path}
                      className={cn(
                        'block w-full text-left px-10 py-3 text-[16px] font-bold transition-all relative',
                        pathname === sub.path
                          ? 'bg-sky-50 text-sky-600'
                          : 'text-slate-800 hover:text-sky-600 hover:bg-sky-50/30'
                      )}
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </SidebarMenuItem>

          {}
          <SidebarMenuItem>
            <Link
              href={stagePath}
              className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-none font-bold transition-all w-full',
                pathname === stagePath
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-900 hover:bg-sky-50/30 hover:text-sky-600'
              )}
            >
              <span className="text-[17px]">Stage</span>
            </Link>
          </SidebarMenuItem>

          {}
          <SidebarMenuItem>
            <Link
              href={`/dashboard/events/${eventId}/sponsors`}
              className={cn(
                'flex items-center gap-3 px-6 py-4 rounded-none font-bold transition-all w-full',
                pathname === `/dashboard/events/${eventId}/sponsors`
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-900 hover:bg-sky-50/30 hover:text-sky-600'
              )}
            >
              <span className="text-[17px]">Sponsor</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {}
      <SidebarFooter className="items-center text-[10px] text-slate-300 px-6 py-6 font-bold uppercase tracking-widest bg-white border-none">
        © {new Date().getFullYear()} Argyle
      </SidebarFooter>
    </Sidebar>
  );
}
