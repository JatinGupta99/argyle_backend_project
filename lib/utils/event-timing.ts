import { Event } from '../types/components';

/**
 * Calculates meeting windows and timing status for an event.
 * nbf (Not Before): startTime - 60 minutes
 * exp (Expiry): endTime + 30 minutes
 */
export function getEventTimingStatus(event: Partial<Event>) {
    if (!event || !event.schedule) {
        return {
            canJoinEarly: false,
            isPastStart: false,
            isPastEnd: false,
            nbfDate: null,
            expDate: null,
            startDate: null,
            endDate: null
        };
    }

    const now = new Date();
    const startDate = new Date(event.schedule.startTime);
    const endDate = new Date(event.schedule.endTime);

    // nbf: 1 hour before start
    const nbfDate = new Date(startDate.getTime() - 3600 * 1000);
    // exp: 30 minutes after end
    const expDate = new Date(endDate.getTime() + 1800 * 1000);

    return {
        canJoinEarly: now >= nbfDate && now < expDate,
        isPastStart: now >= startDate,
        isPastEnd: now >= endDate,
        isExpired: now >= expDate,
        nbfDate,
        expDate,
        startDate,
        endDate
    };
}
