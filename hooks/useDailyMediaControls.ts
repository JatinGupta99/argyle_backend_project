import { useState, useCallback } from 'react';
import { DailyCall } from '@daily-co/daily-js';

export function useDailyMediaControls(callObject: DailyCall | null) {
  const [isMicOn, setMic] = useState(false);
  const [isCamOn, setCam] = useState(false);
  const [isScreenSharing, setScreen] = useState(false);

  const toggleMic = useCallback(() => {
    if (!callObject) return;
    const next = !isMicOn;
    setMic(next);
    callObject.setLocalAudio(next);
  }, [callObject, isMicOn]);

  const toggleCam = useCallback(() => {
    if (!callObject) return;
    const next = !isCamOn;
    setCam(next);
    callObject.setLocalVideo(next);
  }, [callObject, isCamOn]);

  const toggleScreenShare = useCallback(async () => {
    if (!callObject) return;

    if (isScreenSharing) {
      callObject.stopScreenShare();
      setScreen(false);
    } else {
      await callObject.startScreenShare();
      setScreen(true);
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
