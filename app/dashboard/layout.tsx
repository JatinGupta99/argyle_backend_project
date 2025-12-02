'use client';

import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import { RoleView } from '@/lib/slices/uiSlice.ts';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  ChatTab?: {
    title1?: string;
    title2?: string;
    title3?: string;
  };
  chatRole?: RoleView;
  eventId?: string;
  currentUserId?: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen">
      <AppSidebar />
      <main className="flex-grow bg-white-500 overflow-auto">{children}</main>
    </div>
  );
}
