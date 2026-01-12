import type React from 'react';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

import { Inter } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  generator: 'v0.app',
};

import { AuthProvider } from '@/app/auth/auth-context';

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
              <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
