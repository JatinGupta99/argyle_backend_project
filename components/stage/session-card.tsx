'use client';

import Image from 'next/image';

export function SessionCard({
  imageSrc,
  title,
}: {
  imageSrc: string;
  title: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border ring-1 ring-primary/30">
      <Image
        src={imageSrc || '/images/event_image.png'} // fallback corrected
        alt={title}
        width={320}
        height={180}
        className="h-36 w-full object-cover"
        priority
      />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="rounded bg-background/80 px-2 py-1 text-xs font-semibold">
          {title}
        </div>
      </div>
    </div>
  );
}
