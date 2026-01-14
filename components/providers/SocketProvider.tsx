'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null; isConnected: boolean }>({
    socket: null,
    isConnected: false,
});

import { useAuth } from '@/app/auth/auth-context';

export const SocketProvider = ({ children }: {
    children: React.ReactNode    // Use Redux to detect user/token changes if available, otherwise rely on localStorage check loop or event
    // Simplest: Check localStorage periodically or listen to custom event. 
    // OR: since we are inside Provider, maybe we can access store if wrapper allows. 
    // But this file imports from 'socket.io-client'.
    // Let's rely on a window event or just polling if localstorage matches.
    // Actually, best is to pass token as prop or have a context that provides it.
    // But to fix QUICKLY without refactoring auth: relying on localStorage interval or just retry.

    // BETTER FIX: The user is likely logging in via Redux action. 
    // Let's try to import store/hooks if possible? 
    // Yes, 'react-redux' is used in useChat.
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Consume token from AuthContext
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            if (socket) {
                console.log('[SocketProvider] Token removed, disconnecting.');
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Avoid unnecessary reconnection if token hasn't changed (though react effect handles dependency)
        // If we already have a socket connected with THIS token, we are good.
        // But checking token inside socket object is hard.
        // Since 'token' is dependency, this runs on change.

        if (socket) {
            socket.disconnect();
        }

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
        console.log('[SocketProvider] Connecting to:', `${socketUrl}/chat`);

        const s = io(`${socketUrl}/chat`, {
            auth: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

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
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [token]); // Strictly depend on token

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
