import { SidebarProvider } from '../ui/sidebar';
import { ReduxProvider } from './ReduxProvider';
import { StageProvider } from './StageContext';

export function StageProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <StageProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </StageProvider>
    </ReduxProvider>
  );
}
