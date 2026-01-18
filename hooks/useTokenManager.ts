import { useState, useEffect, useMemo } from 'react';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';
import { Role } from '@/app/auth/roles';
import { fetchMeetingToken, joinEventProxy } from '@/lib/api/daily';

interface TokenState {
    token: string | null;
    dailyToken: string | null;
    dailyUrl: string | null;
    isProxying: boolean;
}

export function useTokenManager(
    authToken: string | null,
    role: Role,
    eventId: string,
    eventIsLive: boolean
) {
    const [tokenState, setTokenState] = useState<TokenState>(() => {
        if (typeof window === 'undefined') return { token: null, dailyToken: null, dailyUrl: null, isProxying: false };
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token') || authToken;

        if (urlToken) {
            const details = extractUserDataFromToken(urlToken);
            return {
                token: urlToken,
                dailyToken: details?.dailyToken || null,
                dailyUrl: details?.dailyUrl || null,
                isProxying: false
            };
        }
        return { token: null, dailyToken: null, dailyUrl: null, isProxying: false };
    });

    // Sync with authToken if missing
    useEffect(() => {
        if (!tokenState.token && authToken) {
            const details = extractUserDataFromToken(authToken);
            setTokenState({
                token: authToken,
                dailyToken: details?.dailyToken || null,
                dailyUrl: details?.dailyUrl || null,
                isProxying: false
            });
        }
    }, [authToken, tokenState.token]);

    // Fetch Proxy Token if needed
    useEffect(() => {
        if (tokenState.dailyToken) return;
        if (tokenState.isProxying) return; // Prevent double fetch
        if (!eventIsLive || !eventId) return;

        // Only Attendees usually need proxy, but we handle generic "missing dailyToken"
        // If not attendee and has token, usually means it's a direct invite (should have dailyToken if JWE? or might need proxy)
        // For now, mirroring DailyRoomAttendee logic

        const needsProxy = (role === 'Attendee' && authToken) || (!tokenState.token && role === 'Attendee'); // Simplify for attendee

        if (needsProxy) {
            // Logic from DailyRoomAttendee
            if (role === 'Attendee' && authToken) {
                setTokenState(prev => ({ ...prev, isProxying: true }));
                joinEventProxy(eventId, authToken)
                    .then(res => {
                        if (res) {
                            setTokenState(prev => ({
                                ...prev,
                                dailyToken: res.token,
                                dailyUrl: res.roomUrl || prev.dailyUrl,
                                isProxying: false
                            }));
                        } else {
                            console.warn('[TokenManager] Proxy returned null');
                            setTokenState(prev => ({ ...prev, isProxying: false }));
                        }
                    })
                    .catch(err => {
                        console.error('[TokenManager] Proxy Error', err);
                        setTokenState(prev => ({ ...prev, isProxying: false }));
                    });
            } else if (!tokenState.token) {
                // Guest Attendee? 
                fetchMeetingToken(eventId).then(newToken => {
                    setTokenState(prev => ({ ...prev, token: newToken, dailyToken: null, dailyUrl: null }));
                });
            }
        }
    }, [eventIsLive, eventId, tokenState.token, role, authToken, tokenState.dailyToken, tokenState.isProxying]);

    const userData = useMemo(() => {
        if (!tokenState.token) return null;
        return extractUserDataFromToken(tokenState.token);
    }, [tokenState.token]);

    return {
        ...tokenState,
        userData,
        userName: userData?.name || `Attendee_${Math.floor(Math.random() * 1000)}`
    };
}
