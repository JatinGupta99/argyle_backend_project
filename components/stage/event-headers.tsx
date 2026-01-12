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
      {/* Hero Image Section */}
      <div className="w-full px-8 md:px-12 mt-6 mb-6">
        <div className="relative aspect-[21/9] md:aspect-[3.5/1] w-full max-w-[60rem] rounded-2xl overflow-hidden shadow-xl border border-white/20 ring-1 ring-black/5 group">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <h1 className="text-white text-2xl md:text-4xl font-black tracking-tight drop-shadow-lg max-w-3xl leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="w-full px-8 md:px-12 pb-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 max-w-[60rem]">
          <h2 className="text-sm font-black text-slate-800 tracking-widest uppercase flex items-center gap-2">
            Event Updates
          </h2>
        </div>
      </div>
    </div>
  );
}
