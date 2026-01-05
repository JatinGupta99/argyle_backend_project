
import { DailyVideo, useAudioTrack, useActiveSpeakerId, useLocalParticipant } from '@daily-co/daily-react';
import { Mic, MicOff } from 'lucide-react';
import React from 'react';

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

    return (
        <div className={`relative bg-slate-900 rounded-lg overflow-hidden shadow border transition-all duration-200 
      ${isSpeaking ? 'border-primary ring-2 ring-primary/50' : 'border-slate-800'} 
      ${className}`}
        >
            <DailyVideo
                type="video"
                sessionId={sessionId}
                mirror={isLocal}
                className="w-full h-full object-cover"
                fit="cover"
            />

            {}
            <div className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white transition-colors
        ${isMicOff ? 'text-red-400' : 'text-green-400'}`}>
                {isMicOff ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </div>

            {}
            <div className={`absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium transition-all ${isSpeaking ? 'bg-primary/80' : ''}`}>
                <span>{isLocal ? 'You' : 'Speaker'}</span>
                {isSpeaking && (
                    <div className="flex items-center gap-1 text-white animate-pulse">
                        <div className="w-1 h-1 bg-white rounded-full" />
                        <span className="font-bold">Speaking...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
