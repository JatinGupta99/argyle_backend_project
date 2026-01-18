import { useState, useEffect } from 'react';
import { DailyCall } from '@daily-co/daily-js';

export function useEventLifecycle(callObject: DailyCall | null) {
    const [isModeratorLive, setIsModeratorLive] = useState(false);
    const [hasBeenLive, setHasBeenLive] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        if (!callObject) return;

        const checkLiveStatus = () => {
            const participants = callObject.participants();
            const live = Object.values(participants).some((p: any) =>
                p.owner && p.userData?.isLive === true
            );

            const ended = Object.values(participants).some((p: any) =>
                p.owner && p.userData?.isEnded === true
            );

            setIsModeratorLive(live);
            setIsEnded(ended);
            if (live) {
                setHasBeenLive(true);
            }
        };

        // Initial check
        checkLiveStatus();

        // Listen for participant updates
        callObject.on('participant-joined', checkLiveStatus);
        callObject.on('participant-updated', checkLiveStatus);
        callObject.on('participant-left', checkLiveStatus);

        return () => {
            callObject.off('participant-joined', checkLiveStatus);
            callObject.off('participant-updated', checkLiveStatus);
            callObject.off('participant-left', checkLiveStatus);
        };
    }, [callObject]);

    return {
        isModeratorLive,
        hasBeenLive,
        isEnded
    };
}
