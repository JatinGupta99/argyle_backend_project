'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{
    socket: Socket | null;
    isConnected: boolean;
    emitOnce: (event: string, data: any, key: string) => void;
    emit: (event: string, data: any, callback?: (res: any) => void) => void;
}>({
    socket: null,
    isConnected: false,
    emitOnce: () => { },
    emit: () => { },
});

import { useAuth } from '@/app/auth/auth-context';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';
let socketInstance: Socket | null = null;

const getSocket = (token: string) => {
    if (!socketInstance) {
        console.log('🔌 [SocketProvider] Initializing new socket instance...');
        socketInstance = io(`${socketUrl}/chat`, {
            auth: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnection: true,
            autoConnect: false,
        });
    } else {
        console.log('🔌 [SocketProvider] Reusing existing socket instance, updating token.');
        socketInstance.auth = { token };
    }
    return socketInstance;
};

export const SocketProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const emittedOnceRef = React.useRef<Set<string>>(new Set());

    // Consume token from AuthContext
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            if (socketInstance) {
                console.log('[SocketProvider] No token, disconnecting instance');
                socketInstance.disconnect();
                setIsConnected(false);
                socketInstance = null; // Reset singleton on logout
                emittedOnceRef.current.clear();
            }
            return;
        }

        const s = getSocket(token);

        const onConnect = () => {
            console.log('✅ [SocketProvider] Socket CONNECTED:', s.id);
            setIsConnected(true);
        };

        const onConnectError = (err: any) => {
            console.error('❌ [SocketProvider] Connection ERROR:', err.message, {
                url: socketUrl,
                transport: s.io?.engine?.transport?.name
            });
            setIsConnected(false);
        };

        const onDisconnect = (reason: string) => {
            console.warn('⚠️ [SocketProvider] Socket DISCONNECTED:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'transport error') {
                console.log('🔄 [SocketProvider] Attempting automatic reconnect...');
                if (token) s.connect();
            }
        };

        s.on('connect', onConnect);
        s.on('connect_error', onConnectError);
        s.on('disconnect', onDisconnect);

        if (!s.connected) {
            console.log('[SocketProvider] Connecting singleton socket...');
            s.connect();
        } else {
            setIsConnected(true);
        }

        setSocket(s);

        return () => {
            s.off('connect', onConnect);
            s.off('connect_error', onConnectError);
            s.off('disconnect', onDisconnect);
        };
    }, [token]);

    const emit = React.useCallback((event: string, data: any, callback?: (res: any) => void) => {
        if (socket && isConnected) {
            if (callback) {
                socket.emit(event, data, callback);
            } else {
                socket.emit(event, data);
            }
        }
    }, [socket, isConnected]);

    const emitOnce = React.useCallback((event: string, data: any, key: string) => {
        if (!socket || !isConnected) {
            console.warn(`🛑 [SocketProvider] Cannot emitOnce '${event}', socket not connected.`);
            return;
        }
        const fullKey = `${socket.id}:${key}`;

        if (!emittedOnceRef.current.has(fullKey)) {
            console.log(`🚀 [SocketProvider] EmitOnce -> ${event}`, data);
            socket.emit(event, data);
            emittedOnceRef.current.add(fullKey);
        } else {
            console.log(`ℹ️ [SocketProvider] Skipping redundant emitOnce -> ${event} (key: ${key})`);
        }
    }, [socket, isConnected]);

    const contextValue = React.useMemo(() => ({
        socket,
        isConnected,
        emitOnce,
        emit
    }), [socket, isConnected, emitOnce, emit]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
