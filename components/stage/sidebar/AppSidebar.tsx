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
    // ↓ Add width class here
    <Sidebar className="w-52  ">
      {/* Header */}
      <SidebarHeader className="h-20 flex items-center px-5 relative bg-transparent ">
        <Image
          src="/argyle-logo.png"
          alt="Argyle"
          width={148}
          height={45}
          className="object-contain mt-3"
        />
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent className="">
        <SidebarMenu>
          {/* Lobby with dropdown */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLobby((prev) => !prev)}
              className=" items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/20 font-bold"
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
            <SidebarMenuButton className="flex items-center gap-2 px-3 py-2 rounded-md font-bold">
              <span>Stage</span>
              <span className="ml-auto w-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Sponsor Menu Item */}
          <SidebarMenuItem>
            <SidebarMenuButton className="flex  gap-2 px-3 py-2 rounded-md hover:bg-muted/20 font-bold">
              <span>Sponsor</span>
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
  );
}
