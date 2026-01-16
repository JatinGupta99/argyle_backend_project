'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null; isConnected: boolean }>({
    socket: null,
    isConnected: false,
});

import { useAuth } from '@/app/auth/auth-context';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
let socketInstance: Socket | null = null;

const getSocket = (token: string) => {
    if (!socketInstance) {
        console.log('[SocketProvider] Creating new socket instance');
        socketInstance = io(`${socketUrl}/chat`, {
            auth: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnection: true,
            autoConnect: false,
        });
    } else {
        // Update token if it changed
        socketInstance.auth = { token };
    }
    return socketInstance;
};

export const SocketProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Consume token from AuthContext
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            if (socketInstance) {
                console.log('[SocketProvider] No token, disconnecting instance');
                socketInstance.disconnect();
                setIsConnected(false);
            }
            return;
        }

        const s = getSocket(token);

        if (!s.connected) {
            console.log('[SocketProvider] Connecting singleton socket...');
            s.connect();
        }

        s.on('connect', () => {
            console.log('[SocketProvider] Connected:', s.id);
            setIsConnected(true);
        });

        s.on('connect_error', (err) => {
            console.error('[SocketProvider] Connection Error:', err.message);
            setIsConnected(false);
        });

        s.on('disconnect', (reason) => {
            console.warn('[SocketProvider] Disconnected:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'transport error') {
                // Low-level errors should trigger reconnect if we still have a token
                if (token) s.connect();
            }
        });

        setSocket(s);

        // DO NOT disconnect on unmount as per user instruction
        return () => {
            s.off('connect');
            s.off('connect_error');
            s.off('disconnect');
        };
    }, [token]); // Strictly depend on token

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
