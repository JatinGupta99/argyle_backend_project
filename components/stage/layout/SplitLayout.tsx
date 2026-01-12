import { cn } from '@/lib/utils';
import React from 'react';

interface SplitLayoutProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function SplitLayout({ sidebar, children, className }: SplitLayoutProps) {
    return (
        <div className={cn("flex h-screen w-screen overflow-hidden bg-background", className)}>
            <aside className="h-full bg-[#FAFAFA] border-r flex-shrink-0 transition-all duration-300 z-10">
                {sidebar}
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden bg-white">
                {children}
            </main>
        </div>
    );
}
