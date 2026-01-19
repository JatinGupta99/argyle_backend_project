

export interface DailyTokenPayload {
    r?: string;
    u?: string;
    user_id?: string;
    is_owner?: boolean;
}

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

export interface DailyJoinResponse {
    token: string;
    roomUrl: string;
}
