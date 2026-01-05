'use client';

import Image from 'next/image';

export function EventHeader({
  title,
  imageSrc,
}: {
  title: string;
  imageSrc: string;
}) {
  return (
    <div className="flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mt-8 mb-4">
        <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 group">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {}
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight drop-shadow-2xl max-w-2xl">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase italic">
            EVENT UPDATES
          </h2>
        </div>
      </div>
    </div>
  );
}
