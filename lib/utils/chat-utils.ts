import { ChatSessionType } from "@/lib/constants/chat";
import { Event } from "@/lib/types/components";

/**
 * Determines the chat session status based on event schedule and moderator status.
 * An event is considered LIVE only if:
 * 1. The current time is past the scheduled start time.
 * 2. AND the event status is set to 'LIVE' (moderator has gone live).
 *
 * @param event The event object containing schedule and status
 * @returns ChatSessionType.LIVE or ChatSessionType.PRE_LIVE
 */
export function getChatSessionStatus(event: Partial<Event>): ChatSessionType {
    if (!event || !event.schedule || !event.status) {
        return ChatSessionType.PRE_LIVE;
    }

    const now = new Date();
    const startTime = new Date(event.schedule.startTime);

    // Check if start time has been reached
    const isTimeReached = now >= startTime;

    // Check if moderator has set status to LIVE
    const isEventStatusLive = event.status === 'LIVE';

    if (isTimeReached && isEventStatusLive) {
        return ChatSessionType.LIVE;
    }

    return ChatSessionType.PRE_LIVE;
}
