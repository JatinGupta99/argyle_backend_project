'use client';

import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import { RoleView } from '@/lib/slices/uiSlice.ts';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  chatTitles?: {
    title1?: string;
    title2?: string;
    title3?: string;
  };
  chatRole?: RoleView;
  eventId?: string;
  currentUserId?: string;
}

export default function DashboardLayout({
  children,
  chatTitles,
  chatRole,
  eventId,
  currentUserId,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar - 1 part */}

      <div className="flex-[1]">
        <AppSidebar />
      </div>

      {/* Main content - 3 parts */}
      <main className="flex-[5] bg-white-500 overflow-auto">{children}</main>
    </div>
  );
}
