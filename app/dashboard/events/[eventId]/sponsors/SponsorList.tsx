'use client';

import { SponsorCard } from '@/components/stage/sponsor-card';
import { useSponsors } from '@/hooks/useSponsors';
import { getSponsorDownloadUrl } from '@/lib/sponsor';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

const SponsorCardMemo = memo(SponsorCard);

export default function SponsorList({ event }: { event: any }) {
  const router = useRouter();
  const { sponsors, loading, error } = useSponsors(event._id);
  const [signedLogoUrls, setSignedLogoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        sponsors.map(async (sponsor) => {
          if (sponsor.logoKey) {
            try {
              const url = await getSponsorDownloadUrl(event._id, sponsor._id);
              if (url) {
                urls[sponsor._id] = url;
              }
            } catch (error) {
              console.error(`Failed to fetch image for sponsor ${sponsor._id}`, error);
            }
          }
        })
      );
      setSignedLogoUrls((prev) => ({ ...prev, ...urls }));
    };

    if (sponsors.length > 0) {
      fetchImages();
    }
  }, [sponsors, event._id]);

  if (loading) return <p className="text-center mt-10">Loading sponsors...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!sponsors?.length) return <p className="text-center mt-20">No sponsors available.</p>;

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-center font-bold text-2xl mb-8">VISIT OUR SPONSORS BOOTHS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {sponsors.map((sponsor) => (
          <button
            key={sponsor._id}
            onClick={() => router.push(`/dashboard/events/${event._id}/sponsors/${sponsor._id}/bill`)}
            className="transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <SponsorCardMemo
              imageSrc={signedLogoUrls[sponsor._id] || sponsor.logoKey}
              name={sponsor.name}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
