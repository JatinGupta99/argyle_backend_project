'use client';

import { useCallback } from 'react';
import { useSocketContext } from '@/components/providers/SocketProvider';

export function useSocket() {
  const { socket, isConnected, emitOnce: contextEmitOnce, emit: contextEmit } = useSocketContext();

  const emit = useCallback(
    (event: string, data: any, callback?: (res: any) => void) => {
      contextEmit(event, data, callback);
    },
    [contextEmit]
  );

  const emitOnce = useCallback(
    (event: string, data: any, key: string) => {
      contextEmitOnce(event, data, key);
    },
    [contextEmitOnce]
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

  return { socket, isConnected, emit, emitOnce, on, off };
}
