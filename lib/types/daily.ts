/**
 * Daily.co related types and enums
 */



/**
 * Payload decoded from Daily.co JWT token
 */
export interface DailyTokenPayload {
    r?: string;        // role field from Daily token
    u?: string;        // user display name
    user_id?: string;  // user identifier
    is_owner?: boolean;  // owner/moderator flag
}

/**
 * Payload decoded from invite JWT token
 */
export interface InviteTokenPayload {
    inviteId?: string;
    eventId?: string;
    email?: string;
    name?: string;
    role?: string;      // "Moderator", "Speaker", "Attendee"
    speakerId?: string; // Speaker/Moderator ID (used as _id in chat)
    is_owner?: boolean; // alternative owner flag
    daily_token?: string; // The token to use for Daily.co join
    dailyToken?: string; // CamelCase version of daily token
    // The room URL override (snake_case)
    dailyRoomUrl?: string; // The room URL override (camelCase)
    user_info?: {
        name?: string;
        email?: string;
        role?: string;
    };
    // Fallback ID fields for different token formats
    id?: string;
    userId?: string;
    sub?: string;
    iat?: number;       // issued at
    exp?: number;       // expiration
}

/**
 * Response from backend when joining a Daily.co room
 */
export interface DailyJoinResponse {
    token: string;
    roomUrl: string;
}
