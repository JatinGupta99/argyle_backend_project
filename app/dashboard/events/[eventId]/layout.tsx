'use client';

import { EventContextProvider } from '@/components/providers/EventContextProvider';
import { useEvent } from '@/hooks/useEvents';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface EventLayoutProps {
  children: React.ReactNode;
}

export default function EventLayout({ children }: EventLayoutProps) {
  const params = useParams();
  const eventId = params?.eventId as string;

  const { event, isLoading, error } = useEvent(eventId);
  console.log(event, 'event');
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!event) {
    console.error('Failed to load event:', error);
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p>Failed to load event details.</p>
        <p className="text-xs text-red-400 mt-2">Error: {error ? JSON.stringify(error) : 'Unknown error'}</p>
        <p className="text-xs text-gray-400">Event ID: {eventId}</p>
      </div>
    );
  }

  return (
    <EventContextProvider event={event}>
      <div className="h-full">{children}</div>
    </EventContextProvider>
  );
}
