'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownDisplayProps {
    startTime: Date;
    eventTitle: string;
    onTimerComplete?: () => void;
    logoUrl?: string;
    onLeave?: () => void;
}


export function CountdownDisplay({
    startTime,
    eventTitle,
    onTimerComplete,
    logoUrl,
    onLeave,
}: CountdownDisplayProps) {

    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(startTime) - +new Date();

            if (difference <= 0) {
                onTimerComplete?.();
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTime());
        }, 1000);

        setTimeLeft(calculateTime());
        return () => clearInterval(timer);
    }, [startTime, onTimerComplete]);

    const TimeBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-xl shadow-2xl flex items-center justify-center border border-border ring-1 ring-black/5">
                <span className="text-3xl sm:text-4xl font-black text-[#1da1f2] tracking-tighter">
                    {value.toString().padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] sm:text-[12px] font-black text-white/80 uppercase tracking-widest">
                {label}
            </span>
        </div>
    );

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#000000]">
            {}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            {}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 relative"
                >
                    {}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none select-none">
                        <span className="text-[120px] font-black tracking-tighter text-slate-400/20">argle.</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-sm relative z-10">
                        Get ready! We're live in
                    </h2>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-start gap-3 sm:gap-6"
                >
                    <TimeBox value={timeLeft.hours} label="Hours" />
                    <div className="text-3xl sm:text-4xl font-black text-white pt-5 opacity-30">:</div>
                    <TimeBox value={timeLeft.minutes} label="Mins" />
                    <div className="text-3xl sm:text-4xl font-black text-white pt-5 opacity-30">:</div>
                    <TimeBox value={timeLeft.seconds} label="Secs" />
                </motion.div>

                {onLeave && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <button
                            onClick={onLeave}
                            className="px-8 py-3 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl font-bold text-slate-400 hover:text-white transition-all text-sm"
                        >
                            Leave Event
                        </button>
                    </motion.div>
                )}
            </div>

        </div>
    );
}
