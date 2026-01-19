import { useState, useCallback } from 'react';
import { useDailyBase } from '@/hooks/useDailyBase';

export function useManualJoin() {
    const [roomUrl, setRoomUrl] = useState('');
    const [token, setToken] = useState('');
    const [userName, setUserName] = useState('Test User');
    const [isConnecting, setIsConnecting] = useState(false);

    // Fix: Correctly passing userData object as 5th argument
    const { callObject, ready, error } = useDailyBase(
        roomUrl,
        isConnecting,
        userName,
        token || null,
        { role: 'manual-tester' }, // userData
        true // startWithMedia
    );

    const connect = useCallback(() => {
        if (!roomUrl) return;
        setIsConnecting(true);
    }, [roomUrl]);

    const disconnect = useCallback(() => {
        setIsConnecting(false);
        if (callObject) {
            callObject.leave();
        }
        // Clean reload to ensure fresh state
        window.location.reload();
    }, [callObject]);

    return {
        // State
        roomUrl,
        setRoomUrl,
        token,
        setToken,
        userName,
        setUserName,
        isConnecting,
        ready,
        error,
        callObject,

        // Actions
        connect,
        disconnect
    };
}
