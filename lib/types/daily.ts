/**
 * Daily.co related types and enums
 */

/**
 * Role-based access control for Daily.co rooms
 */
export enum ROLEBASED {
    ATTENDEE = 'attendee',
    SPEAKER = 'speaker',
    MODERATOR = 'moderator',
}

/**
 * Payload decoded from Daily.co JWT token
 */
export interface DailyTokenPayload {
    r?: string;        // role field from Daily token
    u?: string;        // user display name
    user_id?: string;  // user identifier
    is_owner?: boolean;  // user identifier
}

/**
 * Response from backend when joining a Daily.co room
 */
export interface DailyJoinResponse {
    token: string;
    roomUrl: string;
}
