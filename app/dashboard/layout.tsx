'use client';

import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import React from 'react';
import { ROLES_ADMIN } from '../auth/roles';
interface DashboardLayoutProps {
  children: React.ReactNode;
  ChatTab?: {
    title1?: string;
    title2?: string;
    title3?: string;
  };
  chatRole?: ROLES_ADMIN;
  eventId?: string;
  currentUserId?: string;
}




export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-grow flex flex-col h-full overflow-hidden relative bg-background">
        <main className="flex-grow overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
