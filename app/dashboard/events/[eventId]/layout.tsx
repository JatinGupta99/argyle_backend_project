'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { EventContextProvider } from '@/components/providers/EventContextProvider';
import { useEvent } from '@/hooks/useEvents';

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { event, isLoading, error } = useEvent(eventId);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !event) {
    console.error('❌ Failed to load event:', error);
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Failed to load event details.
      </div>
    );
  }

  return (
    <EventContextProvider event={event}>
      <div >{children}</div>
    </EventContextProvider>
  );
}
