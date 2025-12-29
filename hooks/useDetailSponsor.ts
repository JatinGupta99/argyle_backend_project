'use client';

import { useEffect, useState } from 'react';
import { getDetailedSponsors, Sponsor } from '@/lib/sponsor';

export const useDetailSponsor = (eventId: string, sponsorId: string) => {
    const [sponsor, setSponsor] = useState<Sponsor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId || !sponsorId) {
            setLoading(false);
            return;
        }

        const fetchSponsor = async () => {
            try {
                setLoading(true);
                const list = await getDetailedSponsors(eventId, sponsorId);
                console.log(list, 'sponsorlist')
                setSponsor(list);
            } catch (err: any) {
                setError(err?.message || 'Failed to load sponsor details.');
            } finally {
                setLoading(false);
            }
        };

        fetchSponsor();
    }, [eventId, sponsorId]);

    return { sponsor, loading, error };
};
