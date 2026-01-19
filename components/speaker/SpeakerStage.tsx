import { normalizeRole } from '@/app/auth/access';
import { Role, ROLES_ADMIN } from '@/app/auth/roles';
import { useLocalParticipant, useParticipantIds, useParticipantProperty, useScreenShare } from '@daily-co/daily-react';
import { DailyVideo } from '@daily-co/daily-react';
import { Clock, Radio } from 'lucide-react';
import { useMemo } from 'react';
import { ParticipantTile } from './ParticipantTile';
import { SpeakerControls } from './SpeakerControls';
import { DailyCall } from '@daily-co/daily-js';

interface SpeakerStageProps {
    callObject: DailyCall;
    isLive: boolean;
    isRecording: boolean;
    isMicOn: boolean;
    isCamOn: boolean;
    isScreenSharing: boolean;
    isLoading: boolean;
    toggleLive: () => void;
    toggleMic: () => void;
    toggleCam: () => void;
    toggleScreenShare: () => void;
    role: Role;
    eventId: string;
    startTime?: Date;
    hours: number;
    minutes: number;
    seconds: number;
    hasBeenLive: boolean;
    endEvent: () => void;
    isTimeReached?: boolean;
    userName?: string;
}

export function SpeakerStage({
    callObject,
    isLive,
    isRecording,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isLoading,
    toggleLive,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    role,
    eventId,
    startTime,
    hours,
    minutes,
    seconds,
    hasBeenLive,
    endEvent,
    isTimeReached,
    userName
}: SpeakerStageProps) {
    const localParticipant = useLocalParticipant();
    const participantIds = useParticipantIds();

    // 2. Identify the local participant's identity to avoid remote duplicates
    const localIdentity = useMemo(() => {
        if (!localParticipant) return null;
        const userData = (localParticipant as any).userData || {};
        return userData._id || userData.id || localParticipant.user_name;
    }, [localParticipant]);

    // 1. Filter Remote Speakers and handle duplicates
    const remoteSpeakerIds = useMemo(() => {
        const uniqueParticipants = new Map<string, string>(); // identity -> session_id

        participantIds.forEach(id => {
            const p = callObject.participants()?.[id];
            if (!p || p.local) return;

            const userData = (p as any).userData || {};
            const rawRole = (userData.role || userData.participantType || userData.participant_type || '');
            const pRole = normalizeRole(rawRole);

            // Hide Attendees
            if (pRole === ROLES_ADMIN.Attendee || p.user_name?.toLowerCase().startsWith('attendee_')) {
                return;
            }

            // Include ONLY Speakers (Moderators are hidden producers)
            if (pRole === ROLES_ADMIN.Speaker) {
                // Use userName or userId as unique identity
                const identity = userData._id || userData.id || p.user_name || id;

                // Skip if this is a remote ghost of our local session
                if (localIdentity && identity === localIdentity) return;

                // If we see a duplicate remote, overwrite with the newer one
                uniqueParticipants.set(identity, id);
            }
        });

        return Array.from(uniqueParticipants.values());
    }, [participantIds, callObject, localIdentity]);

    // 2. Identify the local participant's role
    const isLocalSpeaker = role === ROLES_ADMIN.Speaker;

    // 3. Decide who to show on the "Stage"
    let filteredParticipantIds: string[] = [];
    if (remoteSpeakerIds.length > 0) {
        filteredParticipantIds = isLocalSpeaker && localParticipant
            ? [localParticipant.session_id, ...remoteSpeakerIds]
            : remoteSpeakerIds;
    } else if (isLocalSpeaker && localParticipant) {
        filteredParticipantIds = [localParticipant.session_id];
    }

    const { screens } = useScreenShare();
    const hasScreenShare = screens.length > 0;
    // Focus on the most recent share
    const screenId = hasScreenShare ? screens[screens.length - 1].session_id : null;
    // Determine Screen Sharer Name
    const isLocalScreenShare = screenId && (screenId === localParticipant?.session_id || screenId === 'local');
    const remoteScreenUserName = useParticipantProperty(screenId || '', 'user_name');
    const screenUserName = isLocalScreenShare ? userName : remoteScreenUserName;

    // Determine Layout Mode
    let layoutMode: 'single' | 'grid' | 'screen-share' = 'grid';
    if (hasScreenShare) {
        layoutMode = 'screen-share';
    } else if (filteredParticipantIds.length <= 1) {
        layoutMode = 'single';
    }

    return (
        <div className="flex flex-col h-full bg-black">
            {/* Header / Status Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md h-16 flex-none">
                <div className="flex items-center gap-3">
                    {isLive ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            ON AIR
                        </span>
                    ) : (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border
              ${hasBeenLive
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                            <Clock className="w-4 h-4" />
                            {hasBeenLive ? 'ON BREAK' : isTimeReached ? 'OFF AIR' : 'PRE-LIVE PREP'}
                            {startTime && !hasBeenLive && (
                                <span className="font-mono text-xs ml-1">
                                    {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                                </span>
                            )}
                        </span>
                    )}

                    {isRecording && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-red-600/20 text-red-500 border border-red-500/40 animate-pulse">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            REC
                        </span>
                    )}
                </div>
                {!isLive && (
                    <p className="text-xs text-muted-foreground">Attendees cannot see you yet</p>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-black overflow-hidden relative">


                {/* MODE: SCREEN SHARE */}
                {layoutMode === 'screen-share' && screenId && (
                    <div className="flex h-full p-4 gap-4">
                        {/* Main Stage: Screen Share */}
                        <div className="flex-1 bg-black rounded-lg overflow-hidden relative shadow-xl border border-slate-800">
                            <DailyVideo
                                type="screenVideo"
                                sessionId={screenId!}
                                className="w-full h-full object-contain"
                                fit="contain"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                {screenUserName ? `${screenUserName} is presenting` : 'Someone is presenting'}
                            </div>
                        </div>

                        {/* Sidebar: Participants */}
                        <div className="w-64 flex-none flex flex-col gap-3 overflow-y-auto pr-2">
                            {filteredParticipantIds.map((id: string) => (
                                <ParticipantTile
                                    key={id}
                                    sessionId={id}
                                    isLocal={localParticipant?.session_id === id}
                                    className="aspect-video w-full flex-none"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* MODE: SINGLE FULL SCREEN */}
                {layoutMode === 'single' && filteredParticipantIds.length > 0 && (
                    <div className="w-full h-full p-4">
                        <ParticipantTile
                            sessionId={filteredParticipantIds[0]}
                            isLocal={localParticipant?.session_id === filteredParticipantIds[0]}
                            className="w-full h-full"
                        />
                    </div>
                )}

                {/* Fallback for Speaker Self-Preview (Only if they are a speaker and alone) */}
                {layoutMode === 'single' && filteredParticipantIds.length === 0 && isLocalSpeaker && (
                    <div className="w-full h-full p-4">
                        <ParticipantTile
                            sessionId={localParticipant?.session_id || ''}
                            isLocal={true}
                            className="w-full h-full"
                        />
                    </div>
                )}

                {/* STAGE PLACEHOLDER: No speakers (Only for Moderators) */}
                {layoutMode === 'single' && filteredParticipantIds.length === 0 && !isLocalSpeaker && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900/50 backdrop-blur-sm">
                        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                            <Radio className="w-12 h-12 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Stage Empty</h3>
                        <p className="text-slate-400 max-w-sm">
                            The event is {isLive ? 'running' : 'waiting to start'}, but no speakers or attendee are currently on stage.
                        </p>
                    </div>
                )}

                {/* MODE: GRID VIEW */}
                {layoutMode === 'grid' && filteredParticipantIds.length > 0 && (
                    <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
                        <div className={`grid gap-4 max-w-7xl mx-auto w-full transition-all duration-300
                    ${/* 2 People: Side by side */ ''}
                    ${filteredParticipantIds.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl' : ''}
                    
                    ${/* 3 People: 3 side by side on desktop, pyramid on mobile */ ''}
                    ${filteredParticipantIds.length === 3 ? 'grid-cols-1 md:grid-cols-3' : ''}

                    ${/* 4 People: 2x2 Grid */ ''}
                    ${filteredParticipantIds.length === 4 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' : ''}

                    ${/* 5-6 People: 3 columns */ ''}
                    ${filteredParticipantIds.length >= 5 && filteredParticipantIds.length <= 6 ? 'grid-cols-2 md:grid-cols-3' : ''}

                    ${/* 7+ People: 4 columns */ ''}
                    ${filteredParticipantIds.length >= 7 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''}
                `}>
                            {filteredParticipantIds.map((id: string) => (
                                <ParticipantTile
                                    key={id}
                                    sessionId={id}
                                    isLocal={localParticipant?.session_id === id}
                                    className="aspect-video"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <SpeakerControls
                isMicOn={isMicOn}
                isCamOn={isCamOn}
                isScreenSharing={isScreenSharing}
                onToggleMic={toggleMic}
                onToggleCam={toggleCam}
                onToggleScreenShare={toggleScreenShare}
                role={role}
                isLive={isLive}
                onToggleLive={toggleLive}
                onEndEvent={role === ROLES_ADMIN.Moderator ? endEvent : undefined}
                isLoading={isLoading}
                isTimeReached={isTimeReached}
            />
        </div>
    );
}
