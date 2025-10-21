import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isLive: boolean;
  roomUrl: string | null;
}

const initialState: UiState = {
  isLive: true,
  roomUrl: 'https://jatinguptawork.daily.co/IYgdOmH87NbECz55EZ3t',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLive(state, action: PayloadAction<boolean>) {
      state.isLive = action.payload;
    },
    setRoomUrl(state, action: PayloadAction<string | null>) {
      state.roomUrl = action.payload;
    },
  },
});

export const { setLive, setRoomUrl } = uiSlice.actions;
export default uiSlice.reducer;
