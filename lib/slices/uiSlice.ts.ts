import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ChatCategoryType } from '../constants/chat';

export enum ChatTab {
  Everyone = 'Everyone',
  Backstage = 'Backstage',
  Chat = 'Chat',
  QA = 'Q&A',
  Argyle = 'Chat with Argyle here',
  None = '',
}

export enum chatTabsFinal {
  Everyone = 'Everyone',
  Backstage = 'Backstage',
  Chat = 'Chat',
  QA = 'Q&A',
}
export enum RoleView {
  Speaker = 'Speaker',
  Attendee = 'Attendee',
  Moderator = 'Moderator',
}

export interface UIState {
  chatTab: ChatCategoryType | ChatTab;
  unreadCount: number;
  isLive: boolean;
  roomUrl: string | null;
  stageView: ChatTab;
}

const savedTab = (typeof window !== 'undefined' &&
  localStorage.getItem('chatTab')) as ChatTab | null;

const initialState: UIState = {
  chatTab: savedTab || ChatTab.None,
  unreadCount: 0,
  isLive: false,
  roomUrl: null,
  stageView: ChatTab.Chat,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setChatTab(state, action: PayloadAction<ChatTab>) {
      state.chatTab = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatTab', action.payload);
      }
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    setIsLive(state, action: PayloadAction<boolean>) {
      state.isLive = action.payload;
    },
    setRoomUrl(state, action: PayloadAction<string | null>) {
      state.roomUrl = action.payload;
    },
    setStageView(state, action: PayloadAction<ChatTab>) {
      state.stageView = action.payload;
    },
  },
});

export const {
  setChatTab,
  setUnreadCount,
  setIsLive,
  setRoomUrl,
  setStageView,
} = uiSlice.actions;

export const selectChatTab = (state: { ui: UIState }) => state.ui.chatTab;
export const selectUnreadCount = (state: { ui: UIState }) =>
  state.ui.unreadCount;
export const selectIsLive = (state: { ui: UIState }) => state.ui.isLive;
export const selectRoomUrl = (state: { ui: UIState }) => state.ui.roomUrl;
export const selectStageView = (state: { ui: UIState }) => state.ui.stageView;

export default uiSlice.reducer;
