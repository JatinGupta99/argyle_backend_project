import { useState, useEffect } from 'react';
import { useAuth } from '@/app/auth/auth-context';
import { useDailyBase } from '@/hooks/useDailyBase';
import { useTokenManager } from '@/hooks/useTokenManager';
import { Role } from '@/app/auth/roles';
import { getRoleConfig } from '@/app/auth/access';

export function useAttendeeLogic(
    role: Role,
    eventId: string,
    eventIsLive: boolean
) {
    const { token: authToken } = useAuth();

    // 1. Manage Token & Proxy
    const { token, dailyToken, dailyUrl, userName } = useTokenManager(authToken, role, eventId, eventIsLive);

    // 2. Compute Join Token
    const isAuthenticatedAttendee = role === 'Attendee' && !!authToken;
    const joinToken = isAuthenticatedAttendee ? dailyToken : (dailyToken || token);

    // 3. Connect to Daily
    const config = getRoleConfig(role);
    const startWithMedia = !config.start_audio_off && !config.start_video_off;

    const { callObject, ready, error } = useDailyBase(
        dailyUrl || '',
        eventIsLive && !!dailyUrl && !!joinToken, // Wait for valid join token
        userName,
        joinToken,
        { role }, // userData
        startWithMedia
    );

    return {
        // Token State
        token,
        dailyUrl,

        // Connection State
        callObject,
        ready,
        error,

        // Auth
        authToken
    };
}
