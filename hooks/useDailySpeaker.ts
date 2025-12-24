'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDailyBase } from './useDailyBase';
import { toggleLiveState } from '@/lib/api/speaker';
import { UserID } from '@/lib/constants/api';
import { Role, ROLES } from '@/app/auth/roles';
import { canSendMedia, normalizeRole } from '@/app/auth/access';

interface UseDailySpeakerProps {
  roomUrl: string;
  eventId: string;
  role?: Role | string;
  userName?: string;
  token?: string | null;
  enableJoin?: boolean;
  initialIsLive?: boolean;
}

export function useDailySpeaker({ roomUrl, eventId, role: initialRole, userName = ROLES.SPEAKER, token, enableJoin = true, initialIsLive = false }: UseDailySpeakerProps) {
  const role = normalizeRole(initialRole);

  const {
    callObject,
    ready,
    error: baseError,
  } = useDailyBase(roomUrl, enableJoin, userName, token || null);

  const loading = !ready;
  const [isLive, setIsLive] = useState(initialIsLive);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(baseError || null);

  const isMountedRef = useRef(true);
  const isMicOnRef = useRef(isMicOn);
  const isCamOnRef = useRef(isCamOn);

  useEffect(() => {
    isMountedRef.current = true;
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
    if (role !== ROLES.MODERATOR) return;

    setIsLoading(true);
    try {
      const newLiveState = !isLive;
      const success = await toggleLiveState(eventId, newLiveState);
      if (!success) throw new Error('Failed to update live state');

      if (newLiveState) {
        // Only turn on if allowed
        const canAudio = canSendMedia(role, 'audio');
        const canVideo = canSendMedia(role, 'video');

        callObject.setLocalAudio(canAudio && (isMicOnRef.current || true));
        callObject.setLocalVideo(canVideo && (isCamOnRef.current || true));

        if (canAudio) setIsMicOn(isMicOnRef.current || true);
        if (canVideo) setIsCamOn(isCamOnRef.current || true);
      } else {
        callObject.setLocalAudio(false);
        callObject.setLocalVideo(false);
        setIsMicOn(false);
        setIsCamOn(false);
      }
      if (isMountedRef.current) setIsLive(newLiveState);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      console.error('[DailySpeaker] toggleLive', err);
      setError(err?.message || 'Failed to toggle live');
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [callObject, eventId, isLive, role]);

  const toggleMic = useCallback(() => {
    console.log('[useDailySpeaker] toggleMic called', {
      hasCallObject: !!callObject,
      isMounted: isMountedRef.current,
      role,
      canSendAudio: canSendMedia(role, 'audio'),
      currentMicState: isMicOn
    });

    if (!callObject || !isMountedRef.current) {
      console.warn('[useDailySpeaker] toggleMic blocked: no callObject or not mounted');
      return;
    }
    if (!canSendMedia(role, 'audio')) {
      console.warn('[useDailySpeaker] toggleMic blocked: invalid permission');
      return;
    }

    const newState = !isMicOn;
    console.log('[useDailySpeaker] Setting mic to:', newState);
    setIsMicOn(newState);
    callObject.setLocalAudio(newState);
  }, [callObject, isMicOn, role]);

  const toggleCam = useCallback(() => {
    console.log('[useDailySpeaker] toggleCam called', {
      hasCallObject: !!callObject,
      isMounted: isMountedRef.current,
      role,
      canSendVideo: canSendMedia(role, 'video'),
      currentCamState: isCamOn
    });

    if (!callObject || !isMountedRef.current) {
      console.warn('[useDailySpeaker] toggleCam blocked: no callObject or not mounted');
      return;
    }
    if (!canSendMedia(role, 'video')) {
      console.warn('[useDailySpeaker] toggleCam blocked: invalid permission');
      return;
    }

    const newState = !isCamOn;
    console.log('[useDailySpeaker] Setting cam to:', newState);
    setIsCamOn(newState);
    callObject.setLocalVideo(newState);
  }, [callObject, isCamOn, role]);

  const toggleScreenShare = useCallback(async () => {
    if (!callObject || !isMountedRef.current) return;

    try {
      if (isScreenSharing) {
        await callObject.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        if (!canSendMedia(role, 'screenVideo')) return;
        await callObject.startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      console.error('[DailySpeaker] toggleScreenShare', err);
      setError(err?.message || 'Failed to toggle screen share');
    }
  }, [callObject, isScreenSharing, role]);

  useEffect(() => {
    return () => {
      if (callObject && isScreenSharing)
        callObject.stopScreenShare();
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
