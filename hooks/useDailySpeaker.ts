'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDailyBase, ROLEBASED } from './useDailyBase';
import { toggleLiveState } from '@/lib/api/speaker';
import { UserID } from '@/lib/constants/api';

interface UseDailySpeakerProps {
  roomUrl: string;
  eventId: string;
}

export function useDailySpeaker({ roomUrl, eventId }: UseDailySpeakerProps) {
  const {
    callObject,
    loading,
    ready,
    error: baseError,
  } = useDailyBase(roomUrl, UserID, ROLEBASED.SPEAKER);
  const [isLive, setIsLive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(baseError || null);

  const isMountedRef = useRef(true);
  const isMicOnRef = useRef(isMicOn);
  const isCamOnRef = useRef(isCamOn);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);
  useEffect(() => {
    isCamOnRef.current = isCamOn;
  }, [isCamOn]);
  useEffect(() => {
    if (baseError) setError(baseError);
  }, [baseError]);

  const toggleLive = useCallback(async () => {
    if (!callObject || !isMountedRef.current) return;

    setIsLoading(true);
    try {
      const newLiveState = !isLive;
      const success = await toggleLiveState(eventId, newLiveState);
      if (!success) throw new Error('Failed to update live state');

      if (newLiveState) {
        callObject.setLocalAudio(isMicOnRef.current || true);
        callObject.setLocalVideo(isCamOnRef.current || true);
      } else {
        callObject.setLocalAudio(false);
        callObject.setLocalVideo(false);
      }
      if (isMountedRef.current) setIsLive(newLiveState);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      console.error('[DailySpeaker] toggleLive', err);
      setError(err?.message || 'Failed to toggle live');
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [callObject, eventId, isLive]);

  const toggleMic = useCallback(() => {
    if (!callObject || !isMountedRef.current || !isLive) return;
    const newState = !isMicOn;
    setIsMicOn(newState);
    callObject.setLocalAudio(newState);
  }, [callObject, isLive, isMicOn]);

  const toggleCam = useCallback(() => {
    if (!callObject || !isMountedRef.current || !isLive) return;
    const newState = !isCamOn;
    setIsCamOn(newState);
    callObject.setLocalVideo(newState);
  }, [callObject, isLive, isCamOn]);

  const toggleScreenShare = useCallback(async () => {
    if (!callObject || !isMountedRef.current) return;
    try {
      if (isScreenSharing) {
        await callObject.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await callObject.startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      console.error('[DailySpeaker] toggleScreenShare', err);
      setError(err?.message || 'Failed to toggle screen share');
    }
  }, [callObject, isScreenSharing]);

  useEffect(() => {
    return () => {
      if (callObject && isScreenSharing)
        callObject.stopScreenShare().catch(() => {});
    };
  }, [callObject, isScreenSharing]);

  return {
    callObject,
    loading,
    ready,
    error,
    isLive,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isLoading,
    toggleLive,
    toggleMic,
    toggleCam,
    toggleScreenShare,
  };
}
