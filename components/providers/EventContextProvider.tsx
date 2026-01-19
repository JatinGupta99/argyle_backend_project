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
      if (!timeStr) return null;
      if (timeStr instanceof Date) return timeStr;

      const dateAttempt = new Date(timeStr);
      if (isValid(dateAttempt) && timeStr.toString().includes('-')) {
        return dateAttempt;
      }

      if (typeof timeStr === 'string' && event.EventDate) {
        try {
          const parsed = parse(`${event.EventDate} ${timeStr}`, 'yyyy-MM-dd hh:mm a', new Date());
          if (isValid(parsed)) return parsed;
        } catch (e) {
          console.error('[EventContextProvider] Parsing failed:', e);
        }
      }

      return isValid(dateAttempt) ? dateAttempt : null;
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

  const value = useMemo(() => ({ event: normalizedEvent }), [normalizedEvent]);

  return (
    <EventContext.Provider value={value}>
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
