import { jwtDecode } from 'jwt-decode';
import { ROLES, Role } from '@/app/auth/roles';
import type { InviteTokenPayload, DailyTokenPayload } from '@/lib/types/daily';

/**
 * Safely decode a JWT token with error handling
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function getTokenPayload<T = InviteTokenPayload>(token: string): T | null {
    if (!token || typeof token !== 'string') {
        return null;
    }

    try {
        return jwtDecode<T>(token);
    } catch (error) {
        console.warn('[JWT Utils] Failed to decode token:', error);
        return null;
    }
}

/**
 * Check if a JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    if (!payload?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}

/**
 * Generic role mapper - determines role from payload
 * Single source of truth for role determination logic (DRY principle)
 * @param payload - Decoded token payload
 * @returns Role enum value
 */
/**
 * Generic role mapper - determines role from payload
 * Single source of truth for initial role determination logic
 */
function mapPayloadToRole(payload: InviteTokenPayload | null): Role {
    if (!payload) return ROLES.ATTENDEE;

    try {
        // High-privilege check (Owner/Moderator)
        if (payload.is_owner === true || payload.role?.toLowerCase() === 'moderator') {
            return ROLES.MODERATOR;
        }

        // Speaker check
        if (payload.role?.toLowerCase() === 'speaker') {
            return ROLES.SPEAKER;
        }
    } catch (e) {
        console.error('[JWT Utils] Role mapping failed, defaulting to Attendee', e);
    }

    return ROLES.ATTENDEE;
}

/**
 * Extract role from invite token
 */
export function extractRoleFromInviteToken(token: string): Role {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    return mapPayloadToRole(payload);
}

/**
 * Extract role from Daily.co token
 */
export function extractRoleFromDailyToken(token: string): Role {
    const payload = getTokenPayload<DailyTokenPayload>(token);

    if (!payload) return ROLES.ATTENDEE;

    // Daily tokens often use 'is_owner' for moderators/hosts
    return payload.is_owner === true ? ROLES.MODERATOR : ROLES.SPEAKER;
}

/**
 * Determine role from multiple possible sources
 * Order of precedence: Invite Token -> Daily Token -> Default (Attendee)
 */
export function determineRoleWithFallback(
    inviteToken?: string | null,
    dailyToken?: string | null
): Role {
    if (inviteToken) {
        const role = extractRoleFromInviteToken(inviteToken);
        if (role !== ROLES.ATTENDEE) return role;
    }

    if (dailyToken) {
        return extractRoleFromDailyToken(dailyToken);
    }

    return ROLES.ATTENDEE;
}

export function extractNameFromToken(token: string): string | null {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    return payload?.name || payload?.email || null;
}

