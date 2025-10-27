import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ChatTab =
  | 'Everyone'
  | 'Backstage'
  | 'Chat'
  | 'profiles'
  | 'Q&A'
  | ''
  | 'Chat with Argyle here';
export type RoleView = 'attendee' | 'speaker' | 'organizer';

interface UIState {
  chatTab: ChatTab;
  unread: number;
  isLive: boolean;
  roomUrl: string | null;
  stageView: ChatTab;
}

const initialState: UIState = {
  chatTab: 'Everyone',
  unread: 5,
  isLive: false,
  roomUrl: null,
  stageView: 'Chat',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setChatTab(state, action: PayloadAction<ChatTab>) {
      state.chatTab = action.payload;
    },
    setUnread(state, action: PayloadAction<number>) {
      state.unread = action.payload;
    },
    setLive(state, action: PayloadAction<boolean>) {
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

export const { setChatTab, setUnread, setLive, setRoomUrl, setStageView } =
  uiSlice.actions;
export default uiSlice.reducer;
