'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DailyVideo } from '@daily-co/daily-react';
import { DailyParticipant } from '@daily-co/daily-js';
import { User } from 'lucide-react';

interface SpeakerVideoPreviewProps {
  localParticipant: DailyParticipant | null;
  isLive: boolean;
  isCamOn: boolean;
  role?: 'moderator' | 'speaker';
}

export function SpeakerVideoPreview({
  localParticipant,
  isLive,
  isCamOn,
  role = 'speaker',
}: SpeakerVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Handle local preview stream when NOT live
  useEffect(() => {
    let localStream: MediaStream | null = null;

    const startPreview = async () => {
      if (isLive) return; // Don't use local preview if live (use Daily track)
      if (!isCamOn) {
        setStream(null);
        return;
      }

      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });
        setStream(localStream);
      } catch (err) {
        console.error('Failed to get local preview stream:', err);
      }
    };

    startPreview();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLive, isCamOn]);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (isLive && localParticipant) {
    return (
      <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden shadow-xl border border-slate-800">
        <DailyVideo
          type="video"
          sessionId={localParticipant.session_id}
          mirror
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          LIVE
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden shadow-xl border border-slate-800 flex items-center justify-center">
      {isCamOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <p className="text-lg font-medium">Camera is off</p>
        </div>
      )}

      {!isLive && (
        <div className="absolute top-4 left-4 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-sm font-bold">
          {role === 'moderator' ? 'MODERATOR PREVIEW' : 'SPEAKER PREVIEW'}
        </div>
      )}
    </div>
  );
}
