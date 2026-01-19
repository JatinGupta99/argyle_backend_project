import { cn } from '@/lib/utils';
import React from 'react';

interface SplitLayoutProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    sidebarSide?: 'left' | 'right';
}

export function SplitLayout({ sidebar, children, className, sidebarSide = 'left' }: SplitLayoutProps) {
    return (
        <div className={cn("flex h-screen w-full overflow-hidden bg-background", className)}>
            <aside className={cn(
                "h-full bg-background flex-shrink-0 transition-all duration-300 z-10",
                sidebarSide === 'left' ? "border-r order-1" : "border-l order-2"
            )}>
                {sidebar}
            </aside>
            <main className={cn(
                "flex-1 flex flex-col overflow-hidden bg-background",
                sidebarSide === 'left' ? "order-2" : "order-1"
            )}>
                {children}
            </main>
        </div>
    );
}
