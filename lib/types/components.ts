import { ChatCategoryType, ChatSessionType } from '../constants/chat.js';
import { RoleView } from '../slices/uiSlice.ts';

export interface EventPageProps {
  params: { eventId: string };
}
export interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}
export interface ChatPanelProps {
  title1?: string;
  title2?: string;
  title3?: string;
  eventId?: string;
  currentUserId?: string;
  role: RoleView;
  type: ChatSessionType;
  tabs: ChatCategoryType[];
}


export interface DailyRoomDetails {
  dailyRoomName: string;
  dailyRoomUrl: string;
  max_participants: number;
  dailyRoomStatus: string;
}

export interface EventSchedule {
  startTime: string; // ISO 8601 Date string, e.g., "2025-11-11T08:41:00.000Z"
  endTime: string; // ISO 8601 Date string
  _id: string;
}

export interface EventAnalytics {
  registrationsCount: number;
  attendeesCount: number;
  boothClicks: number;
  leadsGenerated: number;
  chatLogsUrl: string;
  pollResultsUrl: string;
  sessionRecordingsUrl: string;
  joinedUsers: string[];
}

// --- Main Event Interface ---

export interface Event {
  _id: string;
  title: string;
  eventDetails: string;
  eventLogoUrl: string;
  EventDate: string; // YYYY-MM-DD format
  schedule: EventSchedule;
  privacy: 'public' | 'private' | string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | string;
  host: string; // User ID
  agendas: any[]; // Consider defining a specific Agenda interface later
  sponsors: any[]; // Consider defining a specific Sponsor interface later
  attendees: any[]; // Consider defining a specific Attendee interface later
  analytics: EventAnalytics;
  invitedUsers: any[]; // Consider defining a specific InvitedUser interface later
  createdBy: string; // User ID
  updatedBy: string | null; // User ID or null
  dailyRoomDetails: DailyRoomDetails;
  createdAt: string; // ISO 8601 Date string
  updatedAt: string; // ISO 8601 Date string
  __v: number;
}

// --- API Response Wrapper ---

/**
 * Interface representing the full response object from the API.
 */
export interface EventApiResponse {
  statusCode: number;
  data: Event;
}
