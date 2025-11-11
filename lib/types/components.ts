import { ChatType } from '../constants/chat.js';
import { RoleView } from '../slices/uiSlice.ts';

export interface AttendeeViewProfilePageProps {
  eventId: string;
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
  type: ChatType;
}
