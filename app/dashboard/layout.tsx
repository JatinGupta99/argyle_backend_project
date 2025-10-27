// app/dashboard/layout.tsx
'use client';

import { AppSidebar } from '@/components/stage/sidebar/AppSidebar';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="grid grid-flow-col grid-rows-8 h-screen w-screen">
      {/* Sidebar - 1/8 width */}
      <div className="col-span-2 bg-blue-500">
        <AppSidebar />
      </div>

      {/* Main content - 7/8 width */}
      <main className="col-span-6 bg-red-500 ">
        {children}
      </main>
    </div>
  );
}
