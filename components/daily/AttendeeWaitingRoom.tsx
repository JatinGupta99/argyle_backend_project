import { useCountdown } from '@/hooks/useCountdown';
import { RoomStateDisplay } from './RoomStateDisplay';
import { AlertCircle, CalendarX } from 'lucide-react';
import { RefreshCw } from 'lucide-react';

interface AttendeeWaitingRoomProps {
    status: 'countdown' | 'unavailable' | 'connection-error' | 'connecting' | 'invalid-invite';
    startTime?: Date;
    error?: string | null;
}

export function AttendeeWaitingRoom({ status, startTime, error }: AttendeeWaitingRoomProps) {

    if (status === 'invalid-invite') {
        return (
            <RoomStateDisplay
                variant="default"
                icon={AlertCircle}
                title="Invalid Invite"
                description="This invite token does not contain a valid room link. Please contact the organizer."
            />
        );
    }

    if (status === 'unavailable') {
        return (
            <RoomStateDisplay
                variant="default"
                icon={CalendarX}
                title="Event Unavailable"
                description="The live room is currently closed. The event may have concluded or is not scheduled for this time."
                action={
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl text-sm font-bold transition-all border border-secondary/20"
                    >
                        <RefreshCw size={16} /> Check Status Again
                    </button>
                }
            />
        );
    }

    if (status === 'connection-error') {
        return (
            <RoomStateDisplay
                variant="default"
                icon={AlertCircle}
                title="Connection Issue"
                description={error ? `${error}. Please try reloading.` : "We're having trouble connecting to the broadcast. Please try reloading."}
                action={
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                    >
                        <RefreshCw size={16} /> Reload Page
                    </button>
                }
            />
        );
    }

    if (status === 'connecting') {
        return (
            <RoomStateDisplay
                isLoading
                title="Connecting to Event"
                description="We are securing your connection to the live room..."
            />
        );
    }

    return <CountdownView startTime={startTime || new Date()} />;
}

function CountdownView({ startTime }: { startTime: Date }) {
    const { hours, minutes, seconds } = useCountdown(startTime);
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black text-white gap-2">
            <p className="text-lg">Event starts in</p>
            <p className="font-bold text-green-400 animate-pulse font-mono text-2xl">
                {hours.toString().padStart(2, '0')}:
                {minutes.toString().padStart(2, '0')}:
                {seconds.toString().padStart(2, '0')}
            </p>
        </div>
    );
}
