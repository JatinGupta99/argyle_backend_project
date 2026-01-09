'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Event } from '@/lib/types/components';
import { parse, isValid } from 'date-fns';

const EventContext = createContext<{ event: Partial<Event> } | undefined>(undefined);

export function EventContextProvider({
  event,
  children,
}: {
  event: Partial<Event>;
  children: React.ReactNode;
}) {
  const normalizedEvent = useMemo(() => {
    if (!event.schedule) return event;

    const parseDateTime = (timeStr: any) => {
      if (!timeStr) return new Date();
      if (timeStr instanceof Date) return timeStr;

      // Check if it's already a full ISO string/Date string
      const dateAttempt = new Date(timeStr);
      if (isValid(dateAttempt) && timeStr.toString().includes('-')) {
        return dateAttempt;
      }

      // If it's a time string (e.g. "09:32 PM") and we have a date
      if (typeof timeStr === 'string' && event.EventDate) {
        try {
          // Format expected: "2026-01-08 09:32 PM" -> "yyyy-MM-dd hh:mm a"
          const parsed = parse(`${event.EventDate} ${timeStr}`, 'yyyy-MM-dd hh:mm a', new Date());
          if (isValid(parsed)) return parsed;
        } catch (e) {
          console.error('[EventContextProvider] Parsing failed:', e);
        }
      }

      return dateAttempt; // Fallback to whatever new Date() gave us
    };

    return {
      ...event,
      schedule: {
        ...event.schedule,
        startTime: parseDateTime(event.schedule.startTime),
        endTime: parseDateTime(event.schedule.endTime),
      },
    } as Partial<Event>;
  }, [event]);

  return (
    <EventContext.Provider value={{ event: normalizedEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within EventContextProvider');
  }
  return context.event;
}
