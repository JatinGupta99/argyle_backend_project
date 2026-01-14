import { DailyVideo, useAudioTrack, useActiveSpeakerId, useParticipantProperty } from '@daily-co/daily-react';
import { Mic, MicOff, User, Shield, Users } from 'lucide-react';
import React from 'react';
import { ROLES_ADMIN } from '@/app/auth/roles';

interface ParticipantTileProps {
    sessionId: string;
    className?: string;
    isLocal?: boolean;
}

export function ParticipantTile({ sessionId, className, isLocal }: ParticipantTileProps) {
    const audioState = useAudioTrack(sessionId);
    const activeSpeakerId = useActiveSpeakerId();
    const isSpeaking = activeSpeakerId === sessionId;
    const isMicOff = audioState.isOff;

    const name = useParticipantProperty(sessionId, 'user_name');
    const isOwner = useParticipantProperty(sessionId, 'owner');

    // Role detection for ROLES_ADMIN
    let role = ROLES_ADMIN.Speaker as string;
    if (isOwner) {
        role = ROLES_ADMIN.Moderator;
    } else if (name?.startsWith('Attendee_')) {
        role = ROLES_ADMIN.Attendee;
    }

    const tracks = useParticipantProperty(sessionId, 'tracks');
    const hasVideo = tracks?.video?.state === 'playable';

    return (
        <div className={`relative bg-slate-900 rounded-lg overflow-hidden shadow border transition-all duration-200 
      ${isSpeaking ? 'border-primary ring-2 ring-primary/50' : 'border-slate-800'} 
      ${className}`}
        >
            {hasVideo ? (
                <DailyVideo
                    type="video"
                    sessionId={sessionId}
                    mirror={isLocal}
                    className="w-full h-full object-cover"
                    fit="cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                        {role === ROLES_ADMIN.Moderator ? (
                            <Shield className="w-8 h-8" />
                        ) : role === ROLES_ADMIN.Attendee ? (
                            <Users className="w-8 h-8" />
                        ) : (
                            <User className="w-8 h-8" />
                        )}
                    </div>
                </div>
            )}

            {/* Mic Status Indicator (Top Right) */}
            <div className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white transition-colors
        ${isMicOff ? 'text-red-400' : 'text-green-400'}`}>
                {isMicOff ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </div>

            {/* Name Label & Speaking Indicator */}
            <div className={`absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-medium transition-all ${isSpeaking ? 'bg-primary/80' : ''}`}>
                <span className="flex items-center gap-1.5">
                    {role === ROLES_ADMIN.Moderator && <Shield className="w-3 h-3 text-blue-400" />}
                    {role === ROLES_ADMIN.Attendee && <Users className="w-3 h-3 text-slate-400" />}
                    {isLocal ? 'You' : (name || 'Participant')}
                    <span className="opacity-60 text-[8px] uppercase tracking-wider ml-1">
                        ({role})
                    </span>
                </span>
                {isSpeaking && (
                    <div className="flex items-center gap-1 text-white animate-pulse">
                        <div className="w-1 h-1 bg-background rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
}
