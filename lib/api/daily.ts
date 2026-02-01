import axios from 'axios';
import { setAttendeeTokenCookie } from '@/lib/utils/cookie-utils';
import { extractUserDataFromToken } from '@/lib/utils/jwt-utils';

export interface DailyTokenResponse {
    token: string;
    roomUrl: string;
}

export const fetchMeetingToken = async (eventId: string, authToken?: string | null): Promise<string | null> => {
    try {
        const { data } = await axios.get<{ data: { token: string } }>(
            `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/join`,
            {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
            }
        );
        return data.data.token;
    } catch (error) {
        console.warn('Failed to fetch meeting token:', error);
        return null;
    }
};

export interface JoinEventResponse {
    token: string;
    roomUrl: string;
    frontendUrl?: string;
}

export const joinEventProxy = async (
    eventId: string,
    token: string
): Promise<JoinEventResponse | null> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/joining`;

    try {
        const response = await axios.post<any>(url, { token });

        const jwtToken = response?.data?.data || response?.data?.token;

        // Save the JWT token to cookie for persistence
        if (jwtToken) {
            setAttendeeTokenCookie(jwtToken);
        }

        // Decode the JWT to extract dailyRoomUrl (it's inside the token, not in the API response root)
        const decodedData = extractUserDataFromToken(jwtToken);
        const roomUrl = decodedData?.dailyUrl || response?.data?.roomUrl || response?.data?.dailyRoomUrl || '';

        console.log('[API] joinEventProxy decoded:', {
            hasToken: !!jwtToken,
            roomUrl,
            dailyToken: decodedData?.dailyToken?.substring(0, 20) + '...',
            eventId: decodedData?.eventId
        });

        return {
            token: jwtToken,
            roomUrl: roomUrl,
            frontendUrl: response?.data?.frontendUrl,
        };
    } catch (error: any) {
        console.error('[API] joinEventProxy failed:', {
            url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        return null;
    }
};

// Event Lifecycle Endpoints
export const goLive = async (eventId: string) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/go-live`);
};

export const stopAiring = async (eventId: string) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/stop-airing`);
};

export const endEvent = async (eventId: string) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/end-event`);
};

// Direct Recording Control Endpoints (for room-level control)
export const startRecordingControl = async (roomName: string) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recordings/room/${roomName}/start`, {
        layout: 'grid',
        type: 'cloud'
    });
};

export const stopRecordingControl = async (roomName: string) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recordings/room/${roomName}/stop`, {
        type: 'cloud'
    });
};
