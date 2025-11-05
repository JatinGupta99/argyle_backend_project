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

const HARD_CODED_EVENT_ID = '68ebe2a64674fa429419ba7d';
const HARD_CODED_USER_ID = '68e630972af1374ec4c36630';

export function useMessages(query: ChatHistoryQuery = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat history
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(
        query as Record<string, string>
      ).toString();
      const endpoint = `/chat/${HARD_CODED_EVENT_ID}/history${params ? `?${params}` : ''}`;
      const data = await apiClient.get(endpoint);
      console.log(data, 'snvdlksdv');
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch chat messages'
      );
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(query)]);

  // Create a new message
  const createMessage = useCallback(async (userId: string, content: string) => {
    const payload = { eventId: HARD_CODED_EVENT_ID, userId, content };
    const newMessage = await apiClient.post('/chat', payload);

    // Use functional update to avoid stale closure
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    return newMessage;
  }, []);

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
