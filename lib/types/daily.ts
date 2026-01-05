

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
    role?: string;
    is_owner?: boolean;
    iat?: number;
    exp?: number;
}

export interface DailyJoinResponse {
    token: string;
    roomUrl: string;
}
