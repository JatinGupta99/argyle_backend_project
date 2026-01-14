import { DailyCall } from '@daily-co/daily-js';

/**
 * Safely updates Daily userData by merging with existing data.
 * This prevents overwriting essential metadata like 'role' or 'isLive'.
 */
export async function mergeUserData(callObject: DailyCall | null, data: Record<string, any>) {
    if (!callObject) return;

    try {
        const participants = callObject.participants();
        const local = participants.local;
        const existingData = (local as any)?.userData || {};

        await (callObject as any).setUserData({
            ...existingData,
            ...data,
        });
        console.log('[DailyUtils] userData merged:', data);
    } catch (err) {
        console.error('[DailyUtils] Failed to merge userData:', err);
    }
}
