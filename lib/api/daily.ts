import axios from 'axios';

export interface DailyTokenResponse {
    token: string;
    roomUrl: string; // Sometimes returned
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

        return {
            token: response?.data?.token,
            roomUrl: response?.data?.roomUrl,
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
