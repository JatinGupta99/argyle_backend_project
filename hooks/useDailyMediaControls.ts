import { useCallback, useEffect, useState } from 'react';
import { DailyCall, DailyParticipant } from '@daily-co/daily-js';
import { ROLES_ADMIN } from '@/app/auth/roles';
import { canSendMedia, normalizeRole } from '@/app/auth/access';

/**
 * useDailyMediaControls - Professional hardware state management
 * 
 * Provider-independent: Uses direct callObject event listeners to ensure
 * synchronization even when used outside a <DailyProvider>.
 */
export function useDailyMediaControls(callObject: DailyCall | null, role?: string) {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const syncState = useCallback((p: DailyParticipant | null) => {
    // If no participant yet, try to get intended state from callObject
    if (!p) {
      if (callObject) {
        setIsMicOn((callObject as any).localAudio?.() ?? false);
        setIsCamOn((callObject as any).localVideo?.() ?? false);
      }
      return;
    }
    setIsMicOn(!!p.audio);
    setIsCamOn(!!p.video);
    setIsScreenSharing(!!p.screen);
  }, [callObject]);

  useEffect(() => {
    if (!callObject) return;

    syncState(callObject.participants().local);

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

  // 3. Listen for takeover messages
  useEffect(() => {
    if (!callObject) return;

    const handleAppMessage = (event: any) => {
      if (event.data?.type === 'SCREEN_SHARE_TAKE_OVER' && event.fromId !== callObject.participants().local?.session_id) {
        console.log('[MediaControls] Screen share takeover received, stopping local share');
        if (callObject.participants().local?.screen) {
          callObject.stopScreenShare();
        }
      }
    };

    callObject.on('app-message', handleAppMessage);
    return () => {
      callObject.off('app-message', handleAppMessage);
    };
  }, [callObject]);

  // High-fidelity toggle actions
  const toggleMic = useCallback(() => {
    if (!callObject) return;

    // Check permissions from central access layer
    if (!canSendMedia(normalizeRole(role), 'audio')) {
      console.warn('[MediaControls] Audio not permitted for role:', role);
      return;
    }

    callObject.setLocalAudio(!isMicOn);
  }, [callObject, isMicOn, role]);

  const toggleCam = useCallback(() => {
    if (!callObject) return;

    // Strict Enforcement: Only Video-permitted roles (Speakers) can toggle camera
    if (!canSendMedia(normalizeRole(role), 'video')) {
      console.warn('[MediaControls] Camera is permanently disabled for', role);
      return;
    }

    callObject.setLocalVideo(!isCamOn);
  }, [callObject, isCamOn, role]);

  const toggleScreenShare = useCallback(async () => {
    if (!callObject) return;

    if (!canSendMedia(normalizeRole(role), 'screenVideo')) {
      console.warn('[MediaControls] Screen share not permitted for role:', role);
      return;
    }

    try {
      if (isScreenSharing) {
        await callObject.stopScreenShare();
      } else {
        // Broadcast takeover signal to others
        callObject.sendAppMessage({ type: 'SCREEN_SHARE_TAKE_OVER' }, '*');
        await callObject.startScreenShare();
      }
    } catch (err: any) {
      console.error('[MediaControls] Screen share toggle failed:', err);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        alert('Screen share denied. Please click "Allow" in the browser prompt to share your screen.');
      } else {
        alert('Failed to start screen share: ' + (err.errorMsg || err.message || 'Unknown error'));
      }
    }
  }, [callObject, isScreenSharing, role]);

  return {
    isMicOn,
    isCamOn,
    isScreenSharing,
    toggleMic,
    toggleCam,
    toggleScreenShare,
  };
}
