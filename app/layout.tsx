import type React from 'react';
import { ReduxProvider } from '@/components/providers/redux-provider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: 'v0.app',
};
