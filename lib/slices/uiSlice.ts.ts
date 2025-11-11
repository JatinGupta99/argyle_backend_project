import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * ----------------------------------------
 * Enums for better type safety
 * ----------------------------------------
 */
export enum ChatTab {
  Everyone = 'Everyone',
  Backstage = 'Backstage',
  Chat = 'Chat',
  Profiles = 'profiles',
  QA = 'Q&A',
  Argyle = 'Chat with Argyle here',
  None = '',
}

export enum RoleView {
  Attendee = 'attendee',
  Speaker = 'speaker',
  Organizer = 'organizer',
}

/**
 * ----------------------------------------
 * State Definition
 * ----------------------------------------
 */
export interface UIState {
  chatTab: ChatTab;
  unreadCount: number;
  isLive: boolean;
  roomUrl: string | null;
  stageView: ChatTab;
}

/**
 * ----------------------------------------
 * Initial State
 * ----------------------------------------
 */
const initialState: UIState = {
  chatTab: ChatTab.Everyone||ChatTab.Chat,
  unreadCount: 0,
  isLive: false,
  roomUrl: null,
  stageView: ChatTab.Chat,
};

/**
 * ----------------------------------------
 * Slice
 * ----------------------------------------
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setChatTab(state, action: PayloadAction<ChatTab>) {
      state.chatTab = action.payload;
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

/**
 * ----------------------------------------
 * Actions
 * ----------------------------------------
 */
export const {
  setChatTab,
  setUnreadCount,
  setIsLive,
  setRoomUrl,
  setStageView,
} = uiSlice.actions;

/**
 * ----------------------------------------
 * Selectors (for cleaner component use)
 * ----------------------------------------
 */
export const selectChatTab = (state: { ui: UIState }) => state.ui.chatTab;
export const selectUnreadCount = (state: { ui: UIState }) =>
  state.ui.unreadCount;
export const selectIsLive = (state: { ui: UIState }) => state.ui.isLive;
export const selectRoomUrl = (state: { ui: UIState }) => state.ui.roomUrl;
export const selectStageView = (state: { ui: UIState }) => state.ui.stageView;

export default uiSlice.reducer;
