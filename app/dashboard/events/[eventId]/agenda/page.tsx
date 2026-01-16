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
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, parse } from 'date-fns';

import { Timeline } from '@/components/ui/timeline';

function AgendaTimeline({ agendas, containerRef }: { agendas: Agenda[], containerRef?: React.RefObject<HTMLDivElement | null> }) {


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

    const timelineData = sortedAgendas.map((item) => ({
        title: item.startTime,
        content: (
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "group relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/20 dark:shadow-none border border-white/40 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:bg-white dark:hover:bg-slate-900/60",
                    )}
                >
                    {/* Decorative radial glow for hover */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(113,205,250,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />

                    <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6 z-10">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight drop-shadow-sm">
                                    {item.title}
                                </h3>
                                {item.hasPoll && (
                                    <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-1.5 shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Poll Session</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {item.description}
                            </p>

                            {item.speakers && item.speakers.length > 0 && (
                                <div className="flex flex-wrap items-center gap-4 pt-4">
                                    <div className="flex -space-x-3">
                                        {item.speakers.map((s) => (
                                            <div key={s._id} className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-[#0f172a] shadow-lg flex items-center justify-center overflow-hidden relative group/avatar ring-2 ring-slate-100 dark:ring-white/5 transition-transform duration-300 hover:scale-110 hover:z-20" title={`${s.name.firstName} ${s.name.lastName}`}>
                                                {s.pictureUrl ? (
                                                    <img src={s.pictureUrl} alt={s.name.firstName} className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                                                ) : (
                                                    <User size={24} className="text-slate-400" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1">
                                            {item.speakers.length === 1
                                                ? `${item.speakers[0].name.firstName} ${item.speakers[0].name.lastName}`
                                                : `Expert Panel Discussion`
                                            }
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md w-fit">
                                            {item.speakers.length === 1 ? item.speakers[0].title : `${item.speakers.length} Featured Speakers`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-none pt-2">
                            <div className="flex items-center gap-2 px-5 py-2.5 bg-[#71cdfa]/10 dark:bg-white/5 rounded-2xl border border-[#71cdfa]/20 dark:border-white/10 shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:bg-[#71cdfa]/15">
                                <Clock size={16} className="text-[#1c97d4]" />
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em]">
                                    {item.startTime} — {item.endTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        ),
    }));

    return (
        <div className="w-full relative py-10">
            <Timeline data={timelineData} containerRef={containerRef} />
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);


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
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/30 dark:bg-[#020617] relative custom-scrollbar"
            >

                {/* Premium Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-[#71cdfa]/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <EventHeader
                        title={event.title || ''}
                        imageSrc={imageSignedUrl || event.eventLogoUrl || '/images/virtual_event.webp'}
                        maxWidthClass={maxWidthClass}
                    />

                    <div className={`w-full px-8 md:px-12 pb-24 ${maxWidthClass} mx-auto mt-4`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Session Timeline</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">Chronological tour of the main event</p>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Stage Sync Active</span>
                                </div>
                            </div>
                        </div>

                        <AgendaTimeline agendas={agendas} containerRef={scrollContainerRef} />

                    </div>
                </div>
            </div>
        </SplitLayout>
    );
}


export default function AgendaPage() {
    return <AgendaPageContent />;
}
