import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { SocketProvider } from '@/components/providers/SocketProvider';
import './globals.css';

import { Inter } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  generator: 'v0.app',
};

import { AuthProvider } from '@/app/auth/auth-context';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <SocketProvider>
                <SidebarProvider>
                  {children}
                  <Toaster position="top-right" richColors />
                </SidebarProvider>
              </SocketProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
