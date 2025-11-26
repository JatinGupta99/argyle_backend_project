'use client';

import { useParams } from 'next/navigation';
import SponsorListWrapper from './SponsorListWrapper';

export default function SponsorsPage() {
  const { eventId } = useParams();

  if (!eventId) return <div>Invalid event</div>;

  return <SponsorListWrapper eventId={eventId as string} />;
}
