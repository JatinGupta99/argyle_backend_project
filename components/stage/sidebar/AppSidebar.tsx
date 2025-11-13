'use client';

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
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const [openLobby, setOpenLobby] = useState(false);
  const router = useRouter();

  const eventId = '69147d39e923fc90e241ee91'; // can be made dynamic later

  const lobbySubItems = [
    { label: 'Updates', path: `/dashboard/events/${eventId}/update` },
    { label: 'Agenda', path: `/dashboard/events/${eventId}/agenda` },
    { label: 'Info', path: `/dashboard/events/${eventId}/info` },
  ];

  return (
    <Sidebar className="w-60">
      {/* Header */}
      <SidebarHeader className="h-16 flex items-center px-3 relative bg-transparent">
        <Image
          src="/argyle-logo.png"
          alt="Argyle"
          width={130}
          height={40}
          className="object-contain"
        />
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent className="p-0">
        <SidebarMenu>
          {/* Lobby with dropdown */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLobby((prev) => !prev)}
              className={cn(
                'items-center gap-2 px-2 py-1.5 rounded-md font-bold transition-colors',
                'hover:bg-sky-100 hover:text-gray-900'
              )}
            >
              <span>Lobby</span>
              <ChevronDown
                className={cn(
                  'transition-transform ml-auto mr-0',
                  openLobby ? 'rotate-180' : 'rotate-0'
                )}
              />
            </SidebarMenuButton>

            {/* Dropdown submenu */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                openLobby ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <ul className="mt-1 ml-3 space-y-0.5">
                {lobbySubItems.map((sub) => (
                  <li key={sub.label}>
                    <button
                      onClick={() => router.push(sub.path)}
                      className={cn(
                        'w-full text-left px-2 py-1 text-sm font-bold rounded-md transition-colors',
                        'text-gray-700 hover:text-gray-900 hover:bg-sky-100'
                      )}
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </SidebarMenuItem>

          {/* Stage Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push(`/dashboard/events/${eventId}/backStage`)}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md font-bold transition-colors',
                'hover:bg-sky-100 hover:text-gray-900'
              )}
            >
              <span>Stage</span>
              <span className="ml-auto w-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Sponsor Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() =>
                router.push(`/dashboard/events/${eventId}/sponsors`)
              }
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md font-bold transition-colors',
                'hover:bg-sky-100 hover:text-gray-900'
              )}
            >
              <span>Sponsor</span>
              <span className="ml-auto w-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="items-center text-xs text-muted-foreground px-2 py-1">
        © {new Date().getFullYear()} Argyle
      </SidebarFooter>
    </Sidebar>
  );
}
