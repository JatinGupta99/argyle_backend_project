import { SidebarProvider } from "../ui/sidebar";
import { ReduxProvider } from "./ReduxProvider";

export function StageProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ReduxProvider>
  );
}
