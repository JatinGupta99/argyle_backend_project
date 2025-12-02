import { useEventContext } from '@/components/providers/EventContextProvider';

export function useEventId(): string {
  const event = useEventContext();
  if (!event?._id)
    throw new Error('Event ID missing: wrap inside EventContextProvider');
  return event._id;
}

export function useEventRequired() {
  const event = useEventContext();
  if (!event)
    throw new Error('useEventRequired must be inside EventContextProvider');
  return event;
}
