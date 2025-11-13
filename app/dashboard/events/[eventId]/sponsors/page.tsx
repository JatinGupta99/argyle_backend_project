'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import SponsorListClient from './SponsorListClient';
import { BaseEventLayout } from '@/components/stage/layout/BaseEventLayout';
import { RoleView } from '@/lib/slices/uiSlice.ts';

export default function SponsorsPage() {
  const event = useEventContext();
  return (
    <BaseEventLayout
      role={RoleView.Attendee}
      eventId={event._id}
      title={event.title}
    >
      <section className="flex flex-col flex-1 overflow-hidden p-6">
        <h1 className="font-bold text-center mb-6">
          VISIT OUR SPONSORS' BOOTHS
        </h1>
        <SponsorListClient eventId={event._id} />
      </section>
    </BaseEventLayout>
  );
}
