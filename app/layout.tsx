import type React from 'react';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import './globals.css';

import { Inter } from 'next/font/google';
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <ReduxProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
