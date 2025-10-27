'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { EventUpdates } from '@/components/stage/event-updates';
import { Header } from '@/components/stage/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen bg-background overflow-hidden">
          <section className="flex-1 overflow-y-auto">
            <Header title="Financial Controller Leadership Forum: Redefining Trad..." />
            <EventUpdates />
          </section>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
