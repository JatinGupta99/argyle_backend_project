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
    <div className="relative overflow-hidden rounded-xl border ring-1 ring-primary/30 max-w-md">
      <Image
        src={imageSrc || '/images/event_image.png'}
        alt={title}
        width={480} 
        height={270}
        className="h-48 w-full object-cover" 
        priority
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="rounded-md bg-background/80 px-3 py-2 text-sm font-semibold text-gray-900">
          {title}
        </div>
      </div>
    </div>
  );
}
