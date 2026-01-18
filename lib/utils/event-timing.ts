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
    const startDate = event.schedule.startTime ? new Date(event.schedule.startTime) : null;
    const endDate = event.schedule.endTime ? new Date(event.schedule.endTime) : null;

    const isValidStart = startDate && !isNaN(startDate.getTime()) && startDate.getTime() > 0;
    const isValidEnd = endDate && !isNaN(endDate.getTime()) && endDate.getTime() > 0;

    // nbf: 1 hour before start
    const nbfDate = isValidStart ? new Date(startDate.getTime() - 3600 * 1000) : null;
    // exp: 30 minutes after end
    const expDate = isValidEnd ? new Date(endDate.getTime() + 1800 * 1000) : null;

    const isExpired = expDate ? now >= expDate : false;



    return {
        canJoinEarly: nbfDate && expDate ? now >= nbfDate && now < expDate : true,
        isPastStart: isValidStart ? now >= startDate : true,
        isPastEnd: isValidEnd ? now >= endDate : false,
        isExpired,
        nbfDate,
        expDate,
        startDate,
        endDate
    };
}
