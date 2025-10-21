'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date | string;
  onComplete?: () => void;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}
export function CountdownTimer({
  targetDate,
  onComplete,
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        onComplete?.();
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeRemaining({
        hours,
        minutes,
        seconds,
        isComplete: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const formatTime = (value: number) => String(value).padStart(2, '0');

  return (
    <div className="w-full py-8 bg-black flex items-start justify-center">
      <div className="bg-black w-[357px] h-[170px] rounded-lg flex flex-col items-center justify-center p-4 mt-20">
        <h2 className="text-4xl font-bold text-white whitespace-nowrap mb-6">
          Get ready! We're live in
        </h2>

        <div className="flex items-center justify-center gap-4">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="bg-white px-6 py-4 rounded-lg min-w-[64px] text-center border border-white">
              <span className="text-4xl font-bold text-sky-400">
                {formatTime(timeRemaining.hours)}
              </span>
            </div>
            <span className="text-sm text-white mt-1">Hours</span>
          </div>

          {/* Colon */}
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold text-sky-400">:</span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="bg-white px-6 py-4 rounded-lg min-w-[64px] text-center border border-white">
              <span className="text-4xl font-bold text-sky-400">
                {formatTime(timeRemaining.minutes)}
              </span>
            </div>
            <span className="text-sm text-white mt-1">Mins</span>
          </div>

          {/* Colon */}
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold text-sky-400">:</span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="bg-white px-6 py-4 rounded-lg min-w-[64px] text-center border border-white">
              <span className="text-4xl font-bold text-sky-400">
                {formatTime(timeRemaining.seconds)}
              </span>
            </div>
            <span className="text-sm text-white mt-1">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
