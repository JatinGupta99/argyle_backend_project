'use client';

import { EventContextProvider } from '@/components/providers/EventContextProvider';
import { useEvent } from '@/hooks/useEvents';
import { useParams } from 'next/navigation';
import SponsorListWrapper from './SponsorListWrapper';

export default function SponsorsPage() {
  const { eventId } = useParams();
  const { event, isLoading, error } = useEvent(eventId as string);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading event…
      </div>
    );

  if (error || !event)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Invalid event
      </div>
    );

  return (
    <EventContextProvider event={event}>
      <SponsorListWrapper event={event} />
    </EventContextProvider>
  );
}
