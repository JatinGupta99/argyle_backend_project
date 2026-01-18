import { useState } from 'react';
import { DailyAudio } from '@daily-co/daily-react';
import { VideoGrid } from './VideoGrid';
import { RoomStateDisplay } from './RoomStateDisplay';
import { CheckCircle2, Clock, LogOut, Loader2 } from 'lucide-react';
import { useEventLifecycle } from '@/hooks/useEventLifecycle';
import { DailyCall } from '@daily-co/daily-js';

interface AttendeeStageProps {
    callObject: DailyCall;
    onLeave: () => void;
}

export function AttendeeStage({ callObject, onLeave }: AttendeeStageProps) {
    const { isModeratorLive, hasBeenLive, isEnded } = useEventLifecycle(callObject);
    const [hasJoinedStage, setHasJoinedStage] = useState(false);

    if (isEnded) {
        return (
            <RoomStateDisplay
                variant="default"
                icon={CheckCircle2}
                title="Event Concluded"
                description="Thank you for attending! The broadcast has officially ended. We hope you enjoyed the session."
                action={
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all"
                        >
                            Check for Session Replay
                        </button>
                        <button
                            onClick={onLeave}
                            className="w-full px-8 py-3 bg-slate-800 border border-white/10 rounded-xl font-bold hover:bg-slate-700 transition-all text-slate-200 flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} /> Leave Event
                        </button>
                    </div>
                }
            />
        );
    }

    if (hasJoinedStage && isModeratorLive) {
        return (
            <div className="relative h-full w-full">
                <DailyAudio autoSubscribeActiveSpeaker maxSpeakers={12} />
                <VideoGrid callObject={callObject} />

                {/* Floating Leave Button */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={onLeave}
                        className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-red-500/80 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold transition-all text-white group"
                    >
                        <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        Exit Stage
                    </button>
                </div>
            </div>
        );
    }

    // If was previously live but now stopped -> SHOW BREAK SCREEN
    if (hasBeenLive && !isModeratorLive) {
        return (
            <RoomStateDisplay
                variant="warning"
                icon={Clock}
                title="Short Break"
                description="The event is currently on a brief intermission. Please stay tuned, we will be back shortly!"
                action={
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-6 py-3 bg-amber-950/30 rounded-2xl border border-amber-500/10">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                            <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">Live Updates Paused</span>
                        </div>
                        <button
                            onClick={onLeave}
                            className="px-6 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
                        >
                            Leave Event
                        </button>
                    </div>
                }
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-6 p-8 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-2">
                <div className={`w-4 h-4 rounded-full ${isModeratorLive ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {isModeratorLive ? 'The Show is Live!' : 'Welcome to the Event'}
                </h2>
                <p className="text-slate-400 max-w-sm leading-relaxed mx-auto">
                    {isModeratorLive
                        ? 'The broadcast has started. You can now join the live stage below.'
                        : 'The room is open and you are connected. Please wait while the moderators prepare for the broadcast.'}
                </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    disabled={!isModeratorLive}
                    onClick={() => setHasJoinedStage(true)}
                    className={`px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl 
            ${isModeratorLive
                            ? 'bg-primary hover:bg-primary/90 text-white transform hover:scale-105 active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
                >
                    {isModeratorLive ? 'Join Event' : 'Waiting for Signal...'}
                </button>

                <button
                    onClick={onLeave}
                    className="px-10 py-3 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl font-bold text-slate-400 hover:text-white transition-all text-sm"
                >
                    Leave Event
                </button>
            </div>


            {!isModeratorLive && (
                <div className="mt-4 flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    Synchronizing with Stage...
                </div>
            )}
        </div>
    );
}
