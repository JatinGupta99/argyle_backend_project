import React from 'react';
import { Loader2, AlertTriangle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RoomStateVariant = 'default' | 'destructive' | 'warning' | 'success';

interface RoomStateDisplayProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    variant?: RoomStateVariant;
    action?: React.ReactNode;
    isLoading?: boolean;
}

export function RoomStateDisplay({
    icon: Icon,
    title,
    description,
    variant = 'default',
    action,
    isLoading
}: RoomStateDisplayProps) {

    const variantStyles = {
        default: "bg-card/60 backdrop-blur-xl border-border text-card-foreground shadow-2xl shadow-black/40",
        destructive: "bg-destructive/5 backdrop-blur-xl border-destructive/20 text-destructive shadow-2xl shadow-destructive/5",
        warning: "bg-yellow-500/5 backdrop-blur-xl border-yellow-500/20 text-yellow-500 shadow-2xl shadow-yellow-500/5",
        success: "bg-green-500/5 backdrop-blur-xl border-green-500/20 text-green-500 shadow-2xl shadow-green-500/5"
    };

    const iconStyles = {
        default: "text-primary bg-primary/10 ring-1 ring-primary/20 shadow-[0_0_15px_-3px_rgba(28,151,212,0.3)]",
        destructive: "text-destructive bg-destructive/10 ring-1 ring-destructive/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]",
        warning: "text-yellow-500 bg-yellow-500/10 ring-1 ring-yellow-500/20 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]",
        success: "text-green-500 bg-green-500/10 ring-1 ring-green-500/20 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]"
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-8 text-center animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className={cn(
                "relative max-w-md w-full rounded-[2rem] border p-10 flex flex-col items-center gap-8 z-10",
                variantStyles[variant]
            )}>

                {/* Icon Container */}
                <div className={cn(
                    "w-24 h-24 rounded-3xl flex items-center justify-center transition-transform hover:scale-105 duration-500",
                    iconStyles[variant]
                )}>
                    {isLoading ? (
                        <Loader2 className="w-12 h-12 animate-spin opacity-90" />
                    ) : Icon ? (
                        <Icon className="w-12 h-12 opacity-100 stroke-[1.5px]" />
                    ) : (
                        <AlertTriangle className="w-12 h-12 opacity-100 stroke-[1.5px]" />
                    )}
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h3 className="text-3xl font-black tracking-tight leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-[320px] mx-auto">
                            {description}
                        </p>
                    )}
                </div>

                {/* Action Button */}
                {action && (
                    <div className="pt-2 w-full flex justify-center">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
