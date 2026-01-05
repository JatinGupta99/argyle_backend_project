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
  eventId: string;
  youtubeUrl?: string;
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
  startTime: Date;
  endTime: Date;
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

export interface Event {
  _id: string;
  title: string;
  eventDetails: string;
  eventLogoUrl: string;
  EventDate: string;
  schedule: EventSchedule;
  privacy: 'public' | 'private' | string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | string;
  host: string;
  agendas: any[];
  sponsors: any[];
  attendees: any[];
  analytics: EventAnalytics;
  invitedUsers: any[];
  createdBy: string;
  updatedBy: string | null;
  dailyRoomDetails: DailyRoomDetails;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EventApiResponse {
  statusCode: number;
  data: Event;
}
