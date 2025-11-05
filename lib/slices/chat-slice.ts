import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type Role = 'organizer' | 'attendee';
export interface ChatMessage {
  id: string;
  author: string;
  role?: Role;
  text: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
}

const initialState: ChatState = {
  messages: [
    {
      id: nanoid(),
      author: 'Nia B.',
      role: 'organizer',
      text: 'Hi everyone! Welcome and thank you for being here. Let us know you are here. Where are you joining us from?',
      timestamp: '7:38AM',
    },
    {
      id: nanoid(),
      author: 'Allan Johns',
      role: 'attendee',
      text: "Hello in this btwn there's space why?",
      timestamp: '7:40AM',
    },
  ],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: {
      reducer(state, action: PayloadAction<ChatMessage>) {
        state.messages.push(action.payload);
      },
      prepare(payload: Omit<ChatMessage, 'id' | 'timestamp'>) {
        return {
          payload: {
            id: nanoid(),
            timestamp: new Date().toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            }),
            ...payload,
          },
        };
      },
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
