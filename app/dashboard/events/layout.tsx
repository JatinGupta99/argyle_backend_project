'use client';

import DashboardLayout from '@/app/dashboard/layout';

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <DashboardLayout>{children}</DashboardLayout></>
  );
}
