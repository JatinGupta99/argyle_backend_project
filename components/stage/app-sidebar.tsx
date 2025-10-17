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

export function AppSidebar() {
  const [openLobby, setOpenLobby] = useState(false);

  const lobbySubItems = [
    { label: 'Updates' },
    { label: 'Agenda' },
    { label: 'Info' },
  ];

  return (
    <Sidebar className="w-48 fixed top-0 left-0 h-screen z-40 bg-background shadow-lg">
      {/* Header */}
      <SidebarHeader className="h-14 border-b flex items-center px-2 relative bg-transparent">
        <Image
          src="/argyle-logo.png"
          alt="Argyle"
          width={148}
          height={45}
          className="object-contain absolute top-6 left-8 z-10"
        />
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent className="pt-4">
        <SidebarMenu>
          {/* Lobby with dropdown */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLobby((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/20"
            >
              <span className="font-semibold">Lobby</span>
              <ChevronDown
                className={cn(
                  'transition-transform duration-200',
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
              <ul className="mt-1 ml-4 space-y-1">
                {lobbySubItems.map((sub) => (
                  <li key={sub.label}>
                    <button className="w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-md transition">
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="font-semibold">Stage</SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="font-semibold">Sponsor</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="items-center text-xs text-muted-foreground px-2 py-2 absolute bottom-0 w-full">
        © {new Date().getFullYear()} Argyle
      </SidebarFooter>
    </Sidebar>
  );
}
