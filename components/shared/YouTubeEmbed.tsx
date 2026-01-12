'use client';

import { useMemo } from 'react';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function YouTubeEmbed({
  url,
  title,
  className,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
}: YouTubeEmbedProps) {
  const videoId = useMemo(() => {
    if (!url) return null;

    const pattern =
      /(?:youtube\.com\/(?:.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    return url.match(pattern)?.[1] ?? null;
  }, [url]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    // 0 = false, 1 = true for YouTube API
    if (autoplay) params.append('autoplay', '1');
    if (!controls) params.append('controls', '0');
    if (muted) params.append('mute', '1');
    if (loop && videoId) {
      params.append('loop', '1');
      params.append('playlist', videoId); // Loop requires playlist param with videoId
    }
    params.append('rel', '0'); // Always hide related videos
    return params.toString();
  }, [autoplay, controls, muted, loop, videoId]);

  if (!videoId) {
    return <div className="text-red-500 text-sm">⚠️ Invalid YouTube URL</div>;
  }

  return (
    <div className="w-full h-full flex justify-center items-center bg-black">
      <iframe
        className={`w-full h-full aspect-video ${className || ''}`}
        src={`https://www.youtube.com/embed/${videoId}?${queryParams}`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
