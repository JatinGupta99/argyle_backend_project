'use client';

import { useEffect, useState } from 'react';
import { SponsorCard } from '@/components/stage/sponsor-card';
import { getSponsors, Sponsor } from '@/lib/sponsor';
import { useRouter } from 'next/navigation';

export default function SponsorListClient({ eventId }: { eventId: string }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await getSponsors(eventId);
        setSponsors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch sponsors:', err);
        setError('Unable to load sponsors.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchSponsors();
  }, [eventId]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading sponsors...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">{error}</p>
    );

  if (sponsors.length === 0)
    return (
      <p className="text-center text-gray-500 col-span-2 mt-20">
        No sponsors available for this event.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto">
      {sponsors.map((sponsor) => (
        <SponsorCard
          key={sponsor._id}
          imageSrc={sponsor.logoKey}
          name={sponsor.name}
          onClick={() =>
            router.push(
              `/dashboard/events/${eventId}/sponsors/${sponsor._id}/bill`
            )
          }
        />
      ))}
    </div>
  );
}
