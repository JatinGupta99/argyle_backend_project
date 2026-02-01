import { useState, useEffect, useMemo } from 'react';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';
import { Role } from '@/app/auth/roles';
import { fetchMeetingToken, joinEventProxy } from '@/lib/api/daily';
import { useAuth } from '@/app/auth/auth-context';
import { getAttendeeTokenCookie } from '@/lib/utils/cookie-utils';

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
    const { setAuth } = useAuth();

    const [tokenState, setTokenState] = useState<TokenState>(() => {
        if (typeof window === 'undefined') return { token: null, dailyToken: null, dailyUrl: null, isProxying: false };

        // First, check for cookie (for returning attendees)
        const cookieToken = getAttendeeTokenCookie();

        // Then check URL params
        const urlParams = new URLSearchParams(window.location.search);
        let urlToken = urlParams.get('token') || authToken;

        if (urlToken && urlToken.includes(' ')) {
            urlToken = urlToken.replace(/ /g, '+');
        }

        // Prioritize: URL token > Cookie token > authToken
        const tokenToUse = urlToken || cookieToken;

        if (tokenToUse) {
            const details = extractUserDataFromToken(tokenToUse);
            return {
                token: tokenToUse,
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
        const needsProxy = (role === 'Attendee' && authToken) || (!tokenState.token && role === 'Attendee');

        if (needsProxy) {
            // Logic from DailyRoomAttendee
            if (role === 'Attendee' && authToken) {
                setTokenState(prev => ({ ...prev, isProxying: true }));
                joinEventProxy(eventId, authToken)
                    .then(res => {
                        if (res) {
                            // The backend returns a new signed JWT containing the daily token
                            const newJwt = res.token;
                            const decoded = extractUserDataFromToken(newJwt);

                            // 1. Upgrade the session globally (persists to localStorage)
                            if (decoded && decoded.userId) {
                                console.log('[TokenManager] Upgrading session with new token from proxy');
                                setAuth(role, decoded.userId, newJwt);
                                // Store with a specific name for debugging/visibility as requested
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('daily_full_token', newJwt);
                                }
                            }

                            // 2. Update local state
                            setTokenState(prev => ({
                                ...prev,
                                token: newJwt, // Store the FULL PROXY JWT as the main token now
                                dailyToken: decoded?.dailyToken || newJwt, // Extract actual Daily token (fallback to raw if fail)
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
    }, [eventIsLive, eventId, tokenState.token, role, authToken, tokenState.dailyToken, tokenState.isProxying, setAuth]);

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
