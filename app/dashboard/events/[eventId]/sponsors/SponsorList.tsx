'use client';

import { SponsorCard } from '@/components/stage/sponsor-card';
import { useRouter } from 'next/navigation';
import { useSponsors } from '@/hooks/useSponsors';

export default function SponsorList({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { sponsors, loading, error } = useSponsors(eventId);

  if (loading) return <p className="text-center mt-10">Loading sponsors...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!sponsors?.length)
    return <p className="text-center mt-20">No sponsors available.</p>;

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-center font-bold text-2xl mb-8">
        VISIT OUR SPONSORS BOOTHS
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {sponsors.map((sponsor) => (
          <button
            key={sponsor._id}
            onClick={() =>
              router.push(
                `/dashboard/events/${eventId}/sponsors/${sponsor._id}/bill`
              )
            }
            className="transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <SponsorCard
              imageSrc={sponsor.logoKey}
              name={sponsor.name}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
