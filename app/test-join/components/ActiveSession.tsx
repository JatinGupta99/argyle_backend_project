import { DailyProvider } from '@daily-co/daily-react';
import { VideoGrid } from '@/components/daily/VideoGrid';
import { DailyCall } from '@daily-co/daily-js';

interface ActiveSessionProps {
    callObject: DailyCall;
    roomUrl: string;
    userName: string;
    handleDisconnect: () => void;
}

export function ActiveSession({ callObject, roomUrl, userName, handleDisconnect }: ActiveSessionProps) {
    return (
        <DailyProvider callObject={callObject}>
            <div className="h-screen w-screen bg-slate-950 flex flex-col">
                <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center text-white">
                    <div>
                        <h1 className="font-bold">Connected to: {roomUrl}</h1>
                        <p className="text-sm text-slate-400">As: {userName}</p>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-bold text-sm"
                    >
                        Disconnect
                    </button>
                </div>
                <div className="flex-1 relative">
                    <VideoGrid callObject={callObject} />
                </div>
            </div>
        </DailyProvider>
    );
}
