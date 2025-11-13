'use client';

import { SponsorCard } from '@/components/stage/sponsor-card';
import { Sponsor } from '@/lib/sponsor';
import { useRouter } from 'next/navigation';

interface SponsorListProps {
  sponsors: Sponsor[];
  eventId: string;
}

export default function SponsorList({ sponsors, eventId }: SponsorListProps) {
  const router = useRouter();

  if (!Array.isArray(sponsors) || sponsors.length === 0) {
    return (
      <p className="text-center text-gray-500 col-span-2 mt-20">
        No sponsors available for this event.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 overflow-y-auto">
      {sponsors.map((sponsor) => (
        <button
          key={sponsor._id}
          onClick={() =>
            router.push(`/dashboard/events/${eventId}/sponsors/${sponsor._id}`)
          }
          className="transition-all hover:shadow-md hover:scale-[1.02] focus:outline-none text-left"
        >
          <SponsorCard imageSrc={sponsor.logoKey} name={sponsor.name} />
        </button>
      ))}
    </div>
  );
}
