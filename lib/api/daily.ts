import axios from 'axios';

export interface DailyTokenResponse {
    token: string;
    roomUrl: string; // Sometimes returned
}

export const fetchMeetingToken = async (eventId: string): Promise<string | null> => {
    try {
        const { data } = await axios.post<{ data: { token: string } }>(
            `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/join`
        );
        return data.data.token;
    } catch (error) {
        console.warn('Failed to fetch meeting token:', error);
        return null;
    }
};
