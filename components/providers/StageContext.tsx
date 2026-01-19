'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StageContextType {
    isBroadcastLive: boolean;
    setBroadcastLive: (isLive: boolean) => void;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export function StageProvider({ children }: { children: ReactNode }) {
    const [isBroadcastLive, setBroadcastLive] = useState(false);

    return (
        <StageContext.Provider value={{ isBroadcastLive, setBroadcastLive }}>
            {children}
        </StageContext.Provider>
    );
}

export function useStageContext() {
    const context = useContext(StageContext);
    if (context === undefined) {
        throw new Error('useStageContext must be used within a StageProvider');
    }
    return context;
}
