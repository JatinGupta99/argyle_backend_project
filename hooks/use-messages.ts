'use client';

import { apiClient } from '@/lib/api-client';
import { useState, useEffect, useCallback } from 'react';

interface User {
  _id: string;
  username: string;
  avatar?: string;
}

interface Message {
  _id: string;
  userId: User;
  content: string;
  likes: string[];
  comments: string[];
  createdAt: string;
}

interface ChatHistoryQuery {
  page?: number;
  limit?: number;
}

const HARD_CODED_EVENT_ID = '672b9df7b91f4d8f1e1c2a9a';
const HARD_CODED_USER_ID = '690c48c8882b436e3343b919';

export function useMessages(type: 'live' | 'preLive', query: ChatHistoryQuery = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Always include `type` in the query params
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...(query as Record<string, string>),
        type, // ensure type is always passed
      }).toString();

      const endpoint = `/chat/${HARD_CODED_EVENT_ID}/history?${params}`;
      const data = await apiClient.get(endpoint);
      console.log(data);
      console.log(data, 'Fetched chat messages');
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chat messages');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(query), type]);

  const createMessage = useCallback(
    async (content: string) => {
      const payload = {
        eventId: HARD_CODED_EVENT_ID,
        userId: HARD_CODED_USER_ID,
        content,
        type, // include same type for sending
      };

      const newMessage = await apiClient.post('/chat', payload);
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    [type]
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    createMessage,
  };
}
