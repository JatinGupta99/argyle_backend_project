'use client';

import { useEffect } from 'react';

import { useMessages } from './use-messages';
import { useSocket } from './use-socket';

export function useRealTimeMessages() {
  const { socket, isConnected } = useSocket();
  const { messages, fetchMessages } = useMessages();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = () => {
      fetchMessages();
    };

    const handleMessageLiked = () => {
      fetchMessages();
    };

    socket.on('message-created', handleNewMessage);
    socket.on('message-liked', handleMessageLiked);

    return () => {
      socket.off('message-created', handleNewMessage);
      socket.off('message-liked', handleMessageLiked);
    };
  }, [socket, isConnected, fetchMessages]);

  return { messages, isConnected };
}
