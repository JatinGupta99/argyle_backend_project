import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AttendeesState {
  mutedStatus: Record<string, boolean>;
  activeSpeaker: string | null;
}

const initialState: AttendeesState = {
  mutedStatus: {
    '1': false,
    '2': false,
    '3': true,
    '4': false,
    '5': true,
  },
  activeSpeaker: '1',
};

const attendeesSlice = createSlice({
  name: 'attendees',
  initialState,
  reducers: {
    toggleMute(state, action: PayloadAction<string>) {
      const attendeeId = action.payload;
      state.mutedStatus[attendeeId] = !state.mutedStatus[attendeeId];
      if (state.mutedStatus[attendeeId]) {
        state.activeSpeaker = null;
      }
    },
    setActiveSpeaker(state, action: PayloadAction<string | null>) {
      state.activeSpeaker = action.payload;
    },
  },
});

export const { toggleMute, setActiveSpeaker } = attendeesSlice.actions;
export default attendeesSlice.reducer;
