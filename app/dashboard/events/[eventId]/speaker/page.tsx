'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useEventContext } from '@/components/providers/EventContextProvider';
import { SpeakerViewContent } from '@/components/speaker/SpeakerViewContent';

export default function SpeakerPage() {
  const event = useEventContext();
  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Event Missing</AlertTitle>
          <AlertDescription>Could not load event information.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const eventId = event._id;
  const roomUrl = event.dailyRoomDetails?.dailyRoomUrl;

  if (!roomUrl || !eventId) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            This event does not have a valid ID or Daily room assigned.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <SpeakerViewContent eventId={eventId} roomUrl={roomUrl} initialIsLive={event.status === 'LIVE'} />;
}
