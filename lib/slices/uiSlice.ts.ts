import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ChatTab = 'everyone' | 'backstage';
export type StageView = 'chat' | 'profiles';

interface UIState {
  chatTab: ChatTab;
  unread: number;
  isLive: boolean;
  roomUrl: string | null;
  stageView: StageView;
}

const initialState: UIState = {
  chatTab: 'everyone',
  unread: 5,
  isLive: false,
  roomUrl: null,
  stageView: 'chat',
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
    setStageView(state, action: PayloadAction<StageView>) {
      state.stageView = action.payload;
    },
  },
});

export const { setChatTab, setUnread, setLive, setRoomUrl, setStageView } =
  uiSlice.actions;
export default uiSlice.reducer;
