'use client';

import { useMemo } from 'react';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ url, title, className }: YouTubeEmbedProps) {
  const videoId = useMemo(() => {
    if (!url) return null;

    const pattern =
      /(?:youtube\.com\/(?:.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    return url.match(pattern)?.[1] ?? null;
  }, [url]);

  if (!videoId) {
    return <div className="text-red-500 text-sm">⚠️ Invalid YouTube URL</div>;
  }

  return (
    <div className="w-full flex justify-center">
      {}
      <div
        className={`relative w-full max-w-3xl overflow-hidden rounded-xl ${className}`}
        style={{ paddingTop: '56.25%' }}
      >
        <iframe
          className="absolute inset-0 h-full w-full rounded-xl"
          src={`https:
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
