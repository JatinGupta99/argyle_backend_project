'use client';

import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardPage() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <div className="flex h-dvh overflow-hidden bg-background">
          {/* Left Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <SidebarInset className="flex flex-1 flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-foreground">
              Welcome to Argyle frontend project
            </h1>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ReduxProvider>
  );
}
