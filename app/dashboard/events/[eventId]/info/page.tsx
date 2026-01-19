'use client';

import { useEventContext } from '@/components/providers/EventContextProvider';
import { useAuth } from '@/app/auth/auth-context';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { getTokenPayload } from '@/lib/utils/jwt-utils';
import {
    Calendar,
    Clock,
    MapPin,
    Info,
    ChevronRight,
    Play,
    LayoutDashboard,
    CheckCircle2,
    Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Event as IEvent } from '@/lib/types/components';

export default function InfoPage() {
    const event = useEventContext() as IEvent;
    const { role, token } = useAuth();

    if (!event || !event._id) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { schedule, status, title, eventDetails, eventLogoUrl } = event;
    const startTime = schedule?.startTime ? new Date(schedule.startTime) : new Date();
    const endTime = schedule?.endTime ? new Date(schedule.endTime) : new Date();

    const isLive = status === 'LIVE';
    const isCompleted = status === 'COMPLETED';

    const getEnterRoute = () => {
        const payload = token ? getTokenPayload<{ inviteId?: string }>(token) : null;
        const inviteId = payload?.inviteId;

        if ((role === ROLES_ADMIN.Moderator || role === ROLES_ADMIN.Speaker) && inviteId) {
            return `/dashboard/events/${event._id}/speakers/${inviteId}`;
        }

        if (role === ROLES_ADMIN.Moderator) return `/dashboard/events/${event._id}/moderator`;
        if (role === ROLES_ADMIN.Speaker) return `/dashboard/events/${event._id}/speaker`;
        return `/dashboard/events/${event._id}/attendees`;
    };

    return (
        <div className="min-h-full bg-slate-950 text-slate-200 pb-12">
            {/* Hero Section */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-slate-950 z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,161,242,0.1),transparent)] z-0" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 h-full flex flex-col justify-end pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-end gap-6"
                    >
                        {eventLogoUrl ? (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 rounded-2xl border border-white/10 p-2 shadow-2xl overflow-hidden flex items-center justify-center">
                                <img src={eventLogoUrl} alt={title} className="max-w-full max-h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center shadow-2xl">
                                <Calendar className="w-12 h-12 text-primary" />
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {isLive ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Live Now
                                    </span>
                                ) : isCompleted ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                        <CheckCircle2 size={12} />
                                        Completed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                        <Clock size={12} />
                                        Upcoming
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                                {title}
                            </h1>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 rounded-3xl border border-white/5 p-8 h-full"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Event Details</h2>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap text-lg">
                                {eventDetails || "No detailed description provided for this session. Join the live show to learn more and engage with the community!"}
                            </p>
                        </div>
                    </motion.section>
                </div>



                {/* Right Column: Schedule & Actions */}
                <div className="space-y-6">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 space-y-6"
                    >
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Schedule</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Date</p>
                                    <p className="text-sm font-bold text-white">{format(startTime, 'EEEE, MMM do, yyyy')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Time</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            {format(startTime, 'hh:mm a')} - {format(endTime, 'hh:mm a')}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">GMT-05:00 Timezone</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link
                                href={getEnterRoute()}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Play size={20} fill="white" />
                                {isLive ? 'Enter Live Event' : 'Go to Stage'}
                            </Link>

                            <Link
                                href="/dashboard/events"
                                className="w-full h-14 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <LayoutDashboard size={18} />
                                Back to Events
                            </Link>
                        </div>
                    </motion.section>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center p-4"
                    >
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                            Powered by Argyle Live Stage
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
