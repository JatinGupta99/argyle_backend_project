'use client';

import { useCallback } from 'react';
import { useSocketContext } from '@/components/providers/SocketProvider';

export function useSocket() {
  const { socket, isConnected } = useSocketContext();

  const emit = useCallback(
    (event: string, data: any) => {
      if (socket) {
        socket.emit(event, data);
      } else {
        console.warn('[useSocket] Cannot emit, socket instance missing:', event);
      }
    },
    [socket, isConnected]
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
