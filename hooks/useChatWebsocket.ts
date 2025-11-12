'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/lib/types/api';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/api-routes';
import { ChatType } from '@/lib/constants/chat';

const getWsUrl = (eventId: string, type: ChatType) =>
  `wss://your-websocket-server/ws/chat/${eventId}?type=${type}`;

interface UseChatWebsocketResult {
  messages: Message[];
  isLoading: boolean;
  isConnecting: boolean;
  sendMessage: (content: string) => Promise<void>;
}

export function useChatWebsocket(
  eventId: string,
  type: ChatType,
  currentUserId: string
): UseChatWebsocketResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Fetch previous chat history ---
  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ data: Message[] }>(
        API_ROUTES.chat.history(eventId, { type })
      );

      const sorted = (response.data ?? []).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(sorted);
    } catch (error) {
      console.error('❌ Failed to fetch chat history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, type]);

  // --- WebSocket connection setup ---
  useEffect(() => {
    if (!eventId) return;

    const wsUrl = getWsUrl(eventId, type);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    setIsConnecting(true);

    ws.onopen = () => {
      console.log('✅ WebSocket connected:', wsUrl);
      setIsConnecting(false);
      fetchHistory();
    };

    ws.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data) as Message;

        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      } catch (err) {
        console.error('⚠️ Error parsing WS message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('⚠️ WebSocket error:', err);
    };

    ws.onclose = () => {
      console.warn('⚠️ WebSocket disconnected.');
      setIsConnecting(false);

      // --- Optional reconnect after 5s ---
      reconnectTimeout.current = setTimeout(() => {
        console.log('🔄 Reconnecting WebSocket...');
        wsRef.current = null;
        // trigger reconnect by re-running effect
      }, 5000);
    };

    return () => {
      console.log('🧹 Cleaning up WebSocket...');
      ws.close();
      wsRef.current = null;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [eventId, type, fetchHistory]);

  // --- Function to send messages ---
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      try {
        await apiClient.post(API_ROUTES.chat.create(eventId), {
          content,
          type,
          senderId: currentUserId,
        });
        // The WS server should broadcast the new message back
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      }
    },
    [eventId, type, currentUserId]
  );

  return { messages, isLoading, isConnecting, sendMessage };
}
