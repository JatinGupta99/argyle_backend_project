'use client';

import { useEffect, useState, useCallback } from 'react';
import { initializeSocket } from '@/lib/socket-client';
import type { Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = initializeSocket();
    setSocket(socketInstance);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
    };
  }, []);

  const emit = useCallback(
    (event: string, data: any) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const off = useCallback(
    (event: string, callback?: (data: any) => void) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  return { socket, isConnected, emit, on, off };
}
