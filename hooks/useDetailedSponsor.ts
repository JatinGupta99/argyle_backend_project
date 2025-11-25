'use client';

import { useEffect, useState } from 'react';
import { getDetailedSponsors } from '@/lib/sponsor';

export const useDetailedSponsor = (eventId: string, sponsorId: string) => {
  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // prevent invalid calls
    if (!eventId || !sponsorId) return;

    const run = async () => {
      try {
        const res = await getDetailedSponsors(eventId, sponsorId);
        if (!res) throw new Error('Sponsor not found');
        setSponsor(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load sponsor.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [eventId, sponsorId]);

  return { sponsor, loading, error };
};
