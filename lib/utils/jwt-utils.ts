import { jwtDecode } from 'jwt-decode';
import { ROLES_ADMIN, Role } from '@/app/auth/roles';
import type { InviteTokenPayload, DailyTokenPayload } from '@/lib/types/daily';

export function getTokenPayload<T = InviteTokenPayload>(token: string): T | null {
    if (!token || typeof token !== 'string') {
        return null;
    }

    // Handle common stringified null/undefined cases to avoid decoding errors
    if (token === 'null' || token === 'undefined' || token.trim() === '') {
        return null;
    }

    // Check for JWE (5 parts) - cannot decode client-side
    // JWS has 3 parts (header.payload.signature)
    if (token.split('.').length === 5) {
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

/**
 * Generic role mapper - determines role from payload
 * Single source of truth for role determination logic (DRY principle)
 * @param payload - Decoded token payload
 * Single source of truth for initial role determination logic
 */
function mapPayloadToRole(payload: InviteTokenPayload | null): Role {
    if (!payload) return ROLES_ADMIN.Attendee;

    try {
        // High-privilege check (Owner/Moderator)
        if (payload.is_owner === true || payload.role?.toLowerCase() === 'moderator' || payload.user_info?.role?.toLowerCase() === 'moderator') {
            return ROLES_ADMIN.Moderator;
        }

        // Speaker check
        if (payload.role?.toLowerCase() === 'speaker' || payload.user_info?.role?.toLowerCase() === 'speaker') {
            return ROLES_ADMIN.Speaker;
        }
    } catch (e) {
        console.error('[JWT Utils] Role mapping failed, defaulting to Attendee', e);
    }

    return ROLES_ADMIN.Attendee;
}

export function extractRoleFromInviteToken(token: string): Role {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    return mapPayloadToRole(payload);
}

export function extractRoleFromDailyToken(token: string): Role {
    const payload = getTokenPayload<DailyTokenPayload>(token);

    if (!payload) return ROLES_ADMIN.Attendee;

    // Daily tokens often use 'is_owner' for moderators/hosts
    return payload.is_owner === true ? ROLES_ADMIN.Moderator : ROLES_ADMIN.Speaker;
}

export function determineRoleWithFallback(
    inviteToken?: string | null,
    dailyToken?: string | null
): Role {
    if (inviteToken) {
        const role = extractRoleFromInviteToken(inviteToken);
        if (role !== ROLES_ADMIN.Attendee) return role;
    }

    if (dailyToken) {
        return extractRoleFromDailyToken(dailyToken);
    }

    return ROLES_ADMIN.Attendee;
}

export function extractNameFromToken(token: string): string | null {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    return payload?.user_info?.name || payload?.name || payload?.email || null;
}

export function extractEmailFromToken(token: string): string | null {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    return payload?.user_info?.email || payload?.email || null;
}

/**
 * Extract complete user details for chat from token
 * Uses speakerId for speakers/moderators, falls back to other ID fields for attendees
 */
export function extractChatUserFromToken(token: string) {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    if (!payload) {
        return null;
    }

    // Determine role
    const role = mapPayloadToRole(payload);

    // Extract _id: use speakerId for speakers/moderators
    let userId: string;
    if (payload.speakerId) {
        userId = payload.speakerId;
    } else {
        // Fallback for attendees or other users
        userId = payload.id || payload.userId || payload.sub || payload.email || 'guest';
    }

    // Extract name and email
    const name = payload.user_info?.name || payload.name || 'Guest';
    const email = payload.user_info?.email || payload.email || null;

    return {
        _id: userId,
        role,
        name,
        avatar: null,
        email
    };
}

/**
 * Extract full user metadata for Daily.co userData
 */
export function extractUserDataFromToken(token: string) {
    const payload = getTokenPayload<InviteTokenPayload>(token);
    if (!payload) {
        console.warn('[JWT Utils] No payload found in token');
        return null;
    }

    // Support both root-level and nested user_info
    const name = payload.user_info?.name || payload.name || 'Guest';
    const email = payload.user_info?.email || payload.email || '';

    // Support daily_url, dailyRoomUrl, etc.
    const roomUrl = payload.dailyRoomUrl || null;
    const dailyToken = payload.daily_token || payload.dailyToken || null;

    // Map role (case-insensitive to be safe)
    const payloadRole = (payload.user_info?.role || payload.role || '').toLowerCase();
    let resolvedRole: Role = ROLES_ADMIN.Attendee;

    if (payloadRole === 'moderator' || payload.is_owner) {
        resolvedRole = ROLES_ADMIN.Moderator;
    } else if (payloadRole === 'speaker') {
        resolvedRole = ROLES_ADMIN.Speaker;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        console.warn('[JWT Utils] Token expired');
        return null;
    }

    const userData = {
        dailyToken: dailyToken,
        dailyUrl: roomUrl,
        name,
        email,
        role: resolvedRole,
        inviteId: payload.inviteId || '',
        userId: payload.speakerId || payload.userId || payload.id || payload.sub || payload.email || 'guest'
    };

    return userData;
}
