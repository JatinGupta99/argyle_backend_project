import { RoomStateDisplay } from './RoomStateDisplay';
import { Clock, Radio, Play } from 'lucide-react';

// ... imports

function DailyRoom({ token, startTime, roomUrl, eventIsLive, role }: DailyRoomProps) {
  const { hours, minutes, seconds } = useCountdown(startTime);
  const [userClickedJoin, setUserClickedJoin] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);

  // ... (existing logic)

  if (!eventIsLive) {
    return (
      <RoomStateDisplay
        icon={Clock}
        title="Event Starts Soon"
        description="The broadcast has not started yet. Please wait for the scheduled time."
        action={
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-4xl font-mono font-bold text-primary tracking-widest bg-primary/5 px-6 py-2 rounded-xl border border-primary/10">
              {hours.toString().padStart(2, '0')}:
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </div>
            {seconds <= 0 && !userClickedJoin && (
              <button
                onClick={() => setUserClickedJoin(true)}
                className="mt-2 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Join Event
              </button>
            )}
          </div>
        }
      />
    );
  }

  if (!userClickedJoin) {
    return (
      <RoomStateDisplay
        variant="success"
        icon={Radio}
        title="Event is Live!"
        description={`You are about to join the stage as a ${detectedRole}.`}
        action={
          <button
            onClick={() => setUserClickedJoin(true)}
            className="flex items-center gap-2 px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <Play size={20} fill="currentColor" /> Join Event Now
          </button>
        }
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div ref={iframeRef} className="w-full h-full" />
    </div>
  );
}

return (
  <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
    <div ref={iframeRef} className="w-full h-full" />
  </div>
);
}

export default DailyRoom;
