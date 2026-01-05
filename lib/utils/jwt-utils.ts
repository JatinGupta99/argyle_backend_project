import { jwtDecode } from 'jwt-decode';
import { ROLES, Role } from '@/app/auth/roles';
import type { InviteTokenPayload, DailyTokenPayload } from '@/lib/types/daily';

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

export function isTokenExpired(token: string): boolean {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    if (!payload?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}

function mapPayloadToRole(payload: InviteTokenPayload | null): Role {
    if (!payload) return ROLES.ATTENDEE;

    try {
        if (payload.is_owner === true || payload.role?.toLowerCase() === 'moderator') {
            return ROLES.MODERATOR;
        }
        if (payload.role?.toLowerCase() === 'speaker') {
            return ROLES.SPEAKER;
        }
    } catch (e) {
        console.error('[JWT Utils] Role mapping failed, defaulting to Attendee', e);
    }

    return ROLES.ATTENDEE;
}

export function extractRoleFromInviteToken(token: string): Role {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    return mapPayloadToRole(payload);
}

export function extractRoleFromDailyToken(token: string): Role {
    const payload = getTokenPayload<DailyTokenPayload>(token);

    if (!payload) return ROLES.ATTENDEE;
    return payload.is_owner === true ? ROLES.MODERATOR : ROLES.SPEAKER;
}

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

