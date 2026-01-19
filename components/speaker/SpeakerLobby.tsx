import { ROLES_ADMIN, Role } from '@/app/auth/roles';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Radio, Shield, Video, VideoOff } from 'lucide-react';
import { useLocalParticipant } from '@daily-co/daily-react';
import { ParticipantTile } from './ParticipantTile';

interface SpeakerLobbyProps {
    role: Role;
    isMicOn: boolean;
    isCamOn: boolean;
    isLive: boolean;
    startTime?: Date;
    onJoin: () => void;
    toggleMic: () => void;
    toggleCam: () => void;
}

export function SpeakerLobby({
    role,
    isMicOn,
    isCamOn,
    isLive,
    startTime,
    onJoin,
    toggleMic,
    toggleCam
}: SpeakerLobbyProps) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
            {/* 1. Background Layer */}
            <div className="absolute inset-0 z-0">
                {role === ROLES_ADMIN.Moderator ? (
                    // Moderator: Clean Professional Gradient
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
                    </div>
                ) : (
                    // Speaker: Immersive Video Preview
                    <>
                        <div className="w-full h-full relative">
                            {/* Use ParticipantTile for consistent preview */}
                            <ParticipantTile
                                sessionId={useLocalParticipant()?.session_id || 'local'}
                                isLocal={true}
                                className="w-full h-full"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
                    </>
                )}
            </div>

            {/* 2. Top-Left Role Indicator */}
            <div className="absolute top-8 left-8 z-20">
                <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase backdrop-blur-xl border shadow-2xl
                ${role === ROLES_ADMIN.Moderator
                            ? 'bg-blue-500/10 text-blue-300 border-blue-400/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'}`}>
                        {role === ROLES_ADMIN.Moderator ? <Shield className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                        {role === ROLES_ADMIN.Moderator ? ROLES_ADMIN.Moderator : ROLES_ADMIN.Speaker}
                    </span>
                </div>
            </div>

            {/* 3. Role-Based Content Layout */}
            {role === ROLES_ADMIN.Moderator ? (
                // MODERATOR JOIN: Centered Card
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col gap-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-400/20">
                                <Shield className="w-10 h-10 text-blue-400" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Stage Control</h2>
                                <div className="flex items-center justify-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${isLive ? 'text-red-400' : 'text-slate-400'}`}>
                                        {isLive ? 'ON AIR' : 'OFF AIR'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                size="lg"
                                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg transition-all"
                                onClick={onJoin}
                            >
                                Enter Control Room
                            </Button>
                            <p className="text-[10px] text-center text-slate-500 mt-6 font-medium uppercase tracking-widest leading-relaxed">
                                You can manage speakers and broadcast state from the stage.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // SPEAKER JOIN: Footer-Pinned Controls (To not block face)
                <div className="absolute inset-x-0 bottom-0 z-10 p-12 flex flex-col items-center">
                    <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex items-center justify-between gap-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">

                        {/* Left: Status */}
                        <div className="flex flex-col gap-1 min-w-[140px]">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                                <span className={`text-sm font-black uppercase tracking-widest ${isLive ? 'text-red-500' : 'text-slate-400'}`}>
                                    {isLive ? 'ON AIR' : 'OFF AIR'}
                                </span>
                            </div>
                            {!isLive && startTime && (
                                <></>
                            )}
                        </div>

                        {/* Center: Device Controls */}
                        <div className="flex items-center gap-6 px-8 border-x border-white/5">
                            <div className="flex flex-col items-center gap-2">
                                <Button
                                    variant={isMicOn ? "outline" : "destructive"}
                                    size="icon"
                                    onClick={toggleMic}
                                    className={`w-12 h-12 rounded-xl transition-all ${isMicOn ? 'bg-background/10 border-border/10' : ''}`}
                                >
                                    {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                                </Button>
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isMicOn ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                                    Mic {isMicOn ? 'On' : 'Off'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <Button
                                    variant={isCamOn ? "outline" : "destructive"}
                                    size="icon"
                                    onClick={toggleCam}
                                    className={`w-12 h-12 rounded-xl transition-all ${isCamOn ? 'bg-background/10 border-border/10' : ''}`}
                                >
                                    {isCamOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                                </Button>
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${isCamOn ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                                    Cam {isCamOn ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex-1 max-w-[280px]">
                            <Button
                                size="lg"
                                className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={onJoin}
                            >
                                Enter Stage
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
