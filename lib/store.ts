import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chat-slice';
import attendeesReducer from './slices/attendees-slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    chat: chatReducer,
    attendees: attendeesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
