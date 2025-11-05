'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar';
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
    <div className="">
      <Sidebar>
        {/* Header */}
        <SidebarHeader className=" h-20 flex items-center px-5 relative bg-transparent">
          <Image
            src="/argyle-logo.png"
            alt="Argyle"
            width={148}
            height={45}
            className="object-contain"
          />
        </SidebarHeader>

        {/* Sidebar content */}
        <SidebarContent className="pt-10">
          <SidebarMenu>
            {/* Lobby with dropdown */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenLobby((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/20 font-semibold"
              >
                <span>Lobby</span>
                <ChevronDown
                  className={cn(
                    'transition-transform duration-200 ml-auto mr-5',
                    openLobby ? 'rotate-180' : 'rotate-0'
                  )}
                />
              </SidebarMenuButton>

              {/* Dropdown submenu */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  openLobby ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <ul className="mt-1 ml-4 space-y-1">
                  {lobbySubItems.map((sub) => (
                    <li key={sub.label}>
                      <button className="w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-md transition font-bold">
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </SidebarMenuItem>

            {/* Stage Menu Item */}
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/20 font-semibold">
                <span>Stage</span>
                {/* Empty span to reserve space for the icon */}
                <span className="ml-auto w-5" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Sponsor Menu Item */}
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/20 font-semibold">
                <span>Sponsor</span>
                {/* Empty span to reserve space for the icon */}
                <span className="ml-auto w-5" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="items-center text-xs text-muted-foreground px-2 py-2">
          © {new Date().getFullYear()} Argyle
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
