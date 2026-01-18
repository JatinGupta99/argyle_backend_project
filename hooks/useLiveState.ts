import { DailyCall } from '@daily-co/daily-js';
import { useCallback, useState, useEffect } from 'react';
import { goLive, stopAiring, endEvent as endEventAPI, startRecordingControl, stopRecordingControl } from '@/lib/api/daily';
import { mergeUserData } from '@/lib/utils/daily-utils';
import { canSendMedia, normalizeRole } from '@/app/auth/access';

/**
 * useLiveState - Professional broadcast management
 * 
 * Manages the platform's live status and ensures hardware tracks are 
 * properly initialized/shut-down during broadcast transitions.
 * 
 * Speakers listen for the moderator's live signal to sync their state.
 */
export function useLiveState(
  callObject: DailyCall | null,
  eventId: string,
  roomUrl: string,
  role?: string,
  initialIsLive: boolean = false
) {
  const [isLive, setIsLive] = useState(initialIsLive);
  const [isLoading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    setIsLive(initialIsLive);
  }, [initialIsLive]);

  // Listen for moderator's live signal AND Recording events
  useEffect(() => {
    if (!callObject) return;

    const checkStatus = () => {
      const participants = callObject.participants();

      // 1. Check Live Status
      for (const id of Object.keys(participants)) {
        const p = participants[id];
        if (p.owner && (p as any).userData?.isLive !== undefined) {
          setIsLive((p as any).userData.isLive);
          break;
        }
      }

      // 2. Check Recording Status
      const recordingState = (callObject as any).recordingState?.();
      setIsRecording(recordingState === 'recording');
    };

    // Listen for updates
    const handleParticipantUpdated = (event: any) => {
      if (event.participant.owner && event.participant.userData?.isLive !== undefined) {
        setIsLive(event.participant.userData.isLive);
      }
    };

    const handleRecordingStarted = () => setIsRecording(true);
    const handleRecordingStopped = () => setIsRecording(false);
    const handleRecordingError = (e: any) => {
      console.error('[LiveState] Recording error:', e);
      setIsRecording(false);
    };

    // Initial check
    checkStatus();

    callObject.on('participant-updated', handleParticipantUpdated);
    callObject.on('recording-started', handleRecordingStarted);
    callObject.on('recording-stopped', handleRecordingStopped);
    callObject.on('recording-error', handleRecordingError);

    return () => {
      callObject.off('participant-updated', handleParticipantUpdated);
      callObject.off('recording-started', handleRecordingStarted);
      callObject.off('recording-stopped', handleRecordingStopped);
      callObject.off('recording-error', handleRecordingError);
    };
  }, [callObject]);

  const toggleLive = useCallback(async () => {
    if (!callObject || !eventId) return;

    const nextLiveState = !isLive;
    const roomName = new URL(roomUrl).pathname.split('/').pop() || '';
    setLoading(true);

    try {
      // 1. Sync local media with the live state - Only if permitted for this role
      if (callObject) {
        const normalizedRole = normalizeRole(role);

        if (canSendMedia(normalizedRole, 'audio')) {
          callObject.setLocalAudio(nextLiveState);
        }

        if (canSendMedia(normalizedRole, 'video')) {
          callObject.setLocalVideo(nextLiveState);
        }

        // 2. Broadcast live state to other participants via Daily metadata
        await mergeUserData(callObject, { isLive: nextLiveState });
      }

      // 3. Backend Event Lifecycle 
      if (nextLiveState) {
        console.log('[LiveState] Going On Air...');
        try {
          await goLive(eventId);
          // Explicitly start recording if requested and not handled by backend
          // await startRecordingControl(roomName);
        } catch (err) {
          console.error('[LiveState] Failed to go live or start recording:', err);
        }
      } else {
        console.log('[LiveState] Stopping Airing (Break)...');
        try {
          await stopAiring(eventId);
          // await stopRecordingControl(roomName);
        } catch (err) {
          console.error('[LiveState] Failed to stop airing or recording:', err);
        }
      }

      setIsLive(nextLiveState);
    } catch (err) {
      console.error('[LiveState] Toggle failed:', err);
    } finally {
      setLoading(false);
    }
  }, [callObject, eventId, isLive, roomUrl]);

  /**
   * Final end-of-event termination
   */
  const endEventHandler = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);

    try {
      // Backend handles: recording finalization + event status to ENDED
      await endEventAPI(eventId);

      // Sync metadata to all participants
      if (callObject) {
        await mergeUserData(callObject, { isLive: false, isEnded: true });
      }

      setIsLive(false);
    } catch (err) {
      console.error('[LiveState] End event failed:', err);
    } finally {
      setLoading(false);
    }
  }, [callObject, eventId]);

  return { isLive, isLoading, isRecording, toggleLive, endEvent: endEventHandler };
}
