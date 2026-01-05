'use client';

import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import { RoleView } from '@/lib/slices/uiSlice';
import React from 'react';
import { Bell } from 'lucide-react';
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
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <AppSidebar />
      <main className="flex-grow overflow-hidden relative bg-white">
        {children}
      </main>
    </div>
  );
}
