'use client';

import { useEffect, useState } from 'react';
import { getSponsors, Sponsor } from '@/lib/sponsor';

export const useSponsors = (eventId: string) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const list = await getSponsors(eventId);
        console.log(list, 'lascnclsakn')
        setSponsors(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load sponsors.');
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [eventId]);

  return { sponsors, loading, error };
};
