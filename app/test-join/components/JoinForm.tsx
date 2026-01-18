import { Loader2 } from 'lucide-react';

interface JoinFormProps {
    roomUrl: string;
    setRoomUrl: (url: string) => void;
    token: string;
    setToken: (token: string) => void;
    userName: string;
    setUserName: (name: string) => void;
    handleConnect: () => void;
    isConnecting: boolean;
    error: string | null;
}

export function JoinForm({
    roomUrl, setRoomUrl,
    token, setToken,
    userName, setUserName,
    handleConnect, isConnecting, error
}: JoinFormProps) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl text-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Manual Daily Join</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                        Error: {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Daily Room URL</label>
                        <input
                            type="text"
                            value={roomUrl}
                            onChange={(e) => setRoomUrl(e.target.value)}
                            placeholder="https://your-domain.daily.co/room-name"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Meeting Token (Optional)</label>
                        <textarea
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Paste your daily token here..."
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-blue-500 focus:outline-none h-24 font-mono text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">User Name</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={handleConnect}
                        disabled={!roomUrl || isConnecting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold transition-all flex items-center justify-center gap-2"
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" /> Connecting...
                            </>
                        ) : 'Connect to Room'}
                    </button>
                </div>
            </div>
        </div>
    );
}
