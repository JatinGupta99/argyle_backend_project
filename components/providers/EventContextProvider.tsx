'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Event } from '@/lib/types/components';

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
    return {
      ...event,
      schedule: {
        ...event.schedule,
        startTime: new Date(event.schedule.startTime),
        endTime: new Date(event.schedule.endTime),
      },
    };
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
