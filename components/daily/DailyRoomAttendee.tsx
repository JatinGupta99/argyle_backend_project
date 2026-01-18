import { useRouter } from 'next/navigation';
import { DailyProvider } from '@daily-co/daily-react';
import { Role } from '@/app/auth/roles';
import { useAttendeeLogic } from '@/hooks/useAttendeeLogic';
import { AttendeeWaitingRoom } from './AttendeeWaitingRoom';
import { AttendeeStage } from './AttendeeStage';

export interface DailyRoomProps {
  role: Role;
  startTime: Date;
  roomUrl: string;
  eventIsLive: boolean;
  eventId: string;
}

export function DailyRoomAttendee({ role, startTime, roomUrl: initialRoomUrl, eventIsLive, eventId }: DailyRoomProps) {
  const router = useRouter();

  const {
    token,
    dailyUrl,
    callObject,
    ready,
    error
  } = useAttendeeLogic(role, eventId, eventIsLive);

  const handleLeave = async () => {
    try {
      if (callObject) {
        await callObject.leave();
      }
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.push(`/dashboard/events/${eventId}/info`);
      } else {
        window.close();
      }
    } catch (err) {
      console.error('[DailyRoomAttendee] Failed to leave:', err);
      router.push(`/dashboard/events/${eventId}/info`);
    }
  };

  // 1. Invalid Invite Check
  if (!dailyUrl && token && !dailyUrl) { // Logic: If we have a token but cannot extract a dailyUrl (and proxy failed to return one), it's invalid
    // Actually useAttendeeLogic handles proxying. If dailyUrl is null but token exists, and we are supposed to have one...
    // The original logic was: if (!roomUrl && token) -> Invalid Invite.
    // roomUrl came from tokenParams.dailyUrl.
    if (!dailyUrl && token) {
      return <AttendeeWaitingRoom status="invalid-invite" />;
    }
  }

  // 2. Error Check
  if (error) {
    const errorMsg = typeof error === 'string' ? error.toLowerCase() : '';
    const isRoomUnavailable = errorMsg.includes('no longer available') ||
      errorMsg.includes('meeting has ended') ||
      errorMsg.includes('room not found') ||
      errorMsg.includes('room_deleted');

    if (isRoomUnavailable) {
      return <AttendeeWaitingRoom status="unavailable" />;
    }
    return <AttendeeWaitingRoom status="connection-error" error={error} />;
  }

  // 3. Not Live Check
  if (!eventIsLive) {
    return <AttendeeWaitingRoom status="countdown" startTime={startTime} />;
  }

  // 4. Connecting Check
  if (!callObject || !ready) {
    return <AttendeeWaitingRoom status="connecting" />;
  }

  // 5. Active Stage
  return (
    <DailyProvider callObject={callObject}>
      <AttendeeStage callObject={callObject} onLeave={handleLeave} />
    </DailyProvider>
  );
}
