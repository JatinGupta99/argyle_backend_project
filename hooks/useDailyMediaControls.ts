import { useCallback, useEffect, useState } from 'react';
import { DailyCall, DailyParticipant } from '@daily-co/daily-js';

/**
 * useDailyMediaControls - Professional hardware state management
 * 
 * Provider-independent: Uses direct callObject event listeners to ensure
 * synchronization even when used outside a <DailyProvider>.
 */
export function useDailyMediaControls(callObject: DailyCall | null) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Function to sync state from a participant object
  const syncState = useCallback((p: DailyParticipant | null) => {
    if (!p) return;
    setIsMicOn(!!p.audio);
    setIsCamOn(!!p.video);
    setIsScreenSharing(!!p.screen);
  }, []);

  useEffect(() => {
    if (!callObject) return;

    // 1. Initial sync
    syncState(callObject.participants().local);

    // 2. Listen for track changes
    const handleParticipantUpdated = (event: { participant: DailyParticipant }) => {
      if (event.participant.local) {
        syncState(event.participant);
      }
    };

    callObject.on('participant-updated', handleParticipantUpdated);

    return () => {
      callObject.off('participant-updated', handleParticipantUpdated);
    };
  }, [callObject, syncState]);

  // High-fidelity toggle actions
  const toggleMic = useCallback(() => {
    if (!callObject) return;
    callObject.setLocalAudio(!isMicOn);
  }, [callObject, isMicOn]);

  const toggleCam = useCallback(() => {
    if (!callObject) return;
    callObject.setLocalVideo(!isCamOn);
  }, [callObject, isCamOn]);

  const toggleScreenShare = useCallback(async () => {
    if (!callObject) return;

    try {
      if (isScreenSharing) {
        await callObject.stopScreenShare();
      } else {
        await callObject.startScreenShare();
      }
    } catch (err) {
      console.error('[MediaControls] Screen share toggle failed:', err);
    }
  }, [callObject, isScreenSharing]);

  return {
    isMicOn,
    isCamOn,
    isScreenSharing,
    toggleMic,
    toggleCam,
    toggleScreenShare,
  };
}
