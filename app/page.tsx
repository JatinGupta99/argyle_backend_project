import { ReduxProvider } from '@/components/providers/redux-provider';
import { SidebarProvider, SidebarInset } from '@/components/ui/Sidebar';
import { AppSidebar } from '@/components/stage/AppSideBar';

export default function Page() {
  return (
    <ReduxProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="h-dvh overflow-hidden flex flex-col items-center justify-center bg-background">
            <h1 className="text-4xl font-bold text-foreground">
              Welcome to argyle frontend project
            </h1>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ReduxProvider>
  );
}
