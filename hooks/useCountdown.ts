'use client';

import { useEffect, useState } from 'react';

export function useCountdown(targetDate: Date) {
  const calculate = () => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const diff = target - now;
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, done: true };

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      done: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}
