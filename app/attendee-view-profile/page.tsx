'use client';

import { ReduxProvider } from '@/components/providers/redux-provider';
import { AppSidebar } from '@/components/stage/app-sidebar';
import { AttendeeGrid } from '@/components/stage/attendee-grid';
import { ChatPanel } from '@/components/stage/left-panel';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AttendeeViewProfilePage() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <div className="h-dvh overflow-hidden flex flex-col">
            {/* Main content grid */}
            <div className="flex-1 overflow-hidden grid grid-cols-[380px_1fr]">
              <main className="border-r bg-secondary min-h-0 flex">
                <ChatPanel />
              </main>

              <section className="bg-white flex min-h-0 flex-col">
                <AttendeeGrid />
              </section>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ReduxProvider>
  );
}
