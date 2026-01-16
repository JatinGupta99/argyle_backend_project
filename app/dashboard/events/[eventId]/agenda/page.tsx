'use client';

import { useAuth } from '@/app/auth/auth-context';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { useEventContext } from '@/components/providers/EventContextProvider';

import { ChatPanel } from '@/components/stage/chat/ChatPanel';
import { EventHeader } from '@/components/stage/event-headers';
import { Header } from '@/components/stage/layout/Header';
import { SplitLayout } from '@/components/stage/layout/SplitLayout';
import { UserID } from '@/lib/constants/api';
import { ChatCategoryType, ChatSessionType } from '@/lib/constants/chat';
import { ChatTab } from '@/lib/slices/uiSlice';
import { getEventDownloadUrl } from '@/lib/event';
import { fetchAgendas } from '@/lib/api/agenda';
import { Agenda } from '@/lib/types/components';
import { Loader2, Calendar, Clock, User, CheckCircle2, Play } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, parse } from 'date-fns';

function AgendaTimeline({ agendas, eventDate }: { agendas: Agenda[], eventDate?: string }) {

    if (agendas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50/30 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 mx-auto max-w-2xl mt-8">
                <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-6 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
                    <Calendar className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">No Agenda Scheduled</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                    The schedule for this event hasn't been posted yet. Check back soon for the full session timeline!
                </p>
            </div>
        );
    }

    // Sort agendas by startTime
    const sortedAgendas = [...agendas].sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="space-y-12 py-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

            {sortedAgendas.map((item, index) => {
                const isLive = false; // Add logic for live sessions if possible (comparing now with date + startTime/endTime)

                return (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex gap-8 md:gap-12 pl-12 md:pl-20 group"
                    >
                        {/* Timeline Node */}
                        <div className={cn(
                            "absolute left-[13px] md:left-[29px] top-6 w-3 h-3 rounded-full border-2 bg-white dark:bg-slate-950 z-10 transition-all duration-500 group-hover:scale-125",
                            isLive ? "border-red-500 ring-4 ring-red-500/20" : "border-slate-400 dark:border-slate-600"
                        )} />

                        {/* Time Column */}
                        <div className="flex flex-col min-w-[80px] pt-1">
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{item.startTime}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.endTime}</span>
                        </div>

                        {/* Content Card */}
                        <div className={cn(
                            "flex-1 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1",
                            isLive && "ring-2 ring-red-500/50"
                        )}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        {isLive && (
                                            <span className="px-2 py-0.5 bg-red-500 text-[10px] font-black text-white rounded-md uppercase tracking-wider animate-pulse">
                                                Live
                                            </span>
                                        )}
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                                        {item.description}
                                    </p>

                                    {item.speakers && item.speakers.length > 0 && (
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="flex -space-x-2">
                                                {item.speakers.map((s) => (
                                                    <div key={s._id} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden relative group/avatar" title={`${s.name.firstName} ${s.name.lastName}`}>
                                                        {s.pictureUrl ? (
                                                            <img src={s.pictureUrl} alt={s.name.firstName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User size={14} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 italic">
                                                {item.speakers.length === 1
                                                    ? `${item.speakers[0].name.firstName} ${item.speakers[0].name.lastName}`
                                                    : `Featuring ${item.speakers.length} Guest Speakers`
                                                }
                                            </span>
                                        </div>
                                    )}

                                </div>

                                <div className="flex-none pt-1">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800">
                                        <Clock size={12} className="text-primary" />
                                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                                            60 Minutes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function AgendaPageContent() {
    const event = useEventContext();
    const { role, userId } = useAuth();
    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageSignedUrl, setImageSignedUrl] = useState<string | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const eventId = event?._id as string;
    const currentUserId = userId || UserID;

    useEffect(() => {
        async function loadData() {
            if (!eventId) return;
            setIsLoading(true);
            try {
                const [agendaData, imageUrl] = await Promise.all([
                    fetchAgendas(eventId),
                    getEventDownloadUrl(eventId)
                ]);
                setAgendas(agendaData);
                if (imageUrl) setImageSignedUrl(imageUrl);
            } catch (err) {
                console.error('Failed to load agenda data:', err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [eventId]);

    const maxWidthClass = isSidebarCollapsed ? 'max-w-[75rem]' : 'max-w-[60rem]';

    if (!event || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-sm font-bold text-slate-500 animate-pulse tracking-widest uppercase">Syncing Schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <SplitLayout
            sidebar={
                <ChatPanel
                    title3={ChatTab.Argyle}
                    role={role || ROLES_ADMIN.Attendee}
                    eventId={eventId}
                    currentUserId={currentUserId}
                    type={ChatSessionType.PRE_LIVE}
                    tabs={[ChatCategoryType.EVERYONE, ChatCategoryType.None]}
                    collapsed={isSidebarCollapsed}
                    onToggleCollapse={setIsSidebarCollapsed}
                />
            }
        >
            <Header title={`${event.title} - Agenda`} />
            <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/30 custom-scrollbar">
                <EventHeader
                    title={event.title || ''}
                    imageSrc={imageSignedUrl || event.eventLogoUrl || '/images/virtual_event.webp'}
                    maxWidthClass={maxWidthClass}
                />

                <div className={`w-full px-8 md:px-12 pb-24 ${maxWidthClass} mx-auto mt-4`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Session Timeline</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Chronological tour of the main event</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Stage Sync Active</span>
                            </div>
                        </div>
                    </div>

                    <AgendaTimeline agendas={agendas} eventDate={event?.EventDate} />

                </div>
            </div>
        </SplitLayout>
    );
}

export default function AgendaPage() {
    return <AgendaPageContent />;
}
