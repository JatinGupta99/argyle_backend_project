import { Clock, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Role } from '@/app/auth/roles';

interface SpeakerStatusDisplayProps {
    status: 'expired' | 'too-early' | 'connection-error' | 'loading';
    hours?: number;
    minutes?: number;
    seconds?: number;
    error?: string | null;
    role?: Role;
}

export function SpeakerStatusDisplay({ status, hours, minutes, seconds, error, role }: SpeakerStatusDisplayProps) {

    if (status === 'expired') {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#000a28] text-white p-6">
                <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center">
                    <Clock className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Event Concluded</h3>
                    <p className="text-slate-400">
                        {role === 'Moderator'
                            ? "This event has ended and the stage is now closed. Thank you for moderating!"
                            : "This event has already ended. Thank you for being a part of it!"}
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'too-early') {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#000a28] text-white p-6">
                <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center">
                    <Clock className="w-12 h-12 text-blue-400 mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2">Too Early</h3>
                    <p className="text-slate-400">The stage will be available 60 minutes before the event starts for preparation.</p>
                    <div className="mt-6 text-3xl font-mono text-white">
                        {hours?.toString().padStart(2, '0')}:{minutes?.toString().padStart(2, '0')}:{seconds?.toString().padStart(2, '0')}
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'connection-error') {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#000a28] text-white p-6 animate-in fade-in duration-500">
                <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                        {error?.toLowerCase().includes('ended') || error?.toLowerCase().includes('not found') || error?.toLowerCase().includes('available')
                            ? 'Broadcast Concluded'
                            : 'Connection Interrupted'}
                    </h3>

                    <p className="text-slate-400 leading-relaxed mb-8">
                        {error?.toLowerCase().includes('ended') || error?.toLowerCase().includes('not found') || error?.toLowerCase().includes('available')
                            ? (role === 'Moderator'
                                ? 'The stage session has concluded. If you need more time, please update the event schedule.'
                                : 'This event has successfully concluded. Thank you for your participation!')
                            : 'We encountered an issue connecting to the stage. This might be due to a network interruption.'}
                    </p>

                    <Button
                        size="lg"
                        onClick={() => window.location.reload()}
                        className="w-full h-12 bg-white text-[#000a28] hover:bg-slate-200 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {error?.toLowerCase().includes('ended') || error?.toLowerCase().includes('not found') || error?.toLowerCase().includes('available')
                            ? 'Back to Dashboard'
                            : 'Reconnect to Stage'}
                    </Button>

                    {error &&
                        error !== 'Meeting has ended' &&
                        !error.toLowerCase().includes('not found') &&
                        !error.toLowerCase().includes('available') && (
                            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/10 rounded-xl w-full">
                                <p className="text-[11px] font-mono text-red-300/80 break-all">
                                    Error Code: {error}
                                </p>
                            </div>
                        )}
                </div>
            </div>
        );
    }

    // Default: Loader
    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-lg font-medium animate-pulse">Joining meeting...</p>
        </div>
    );
}
