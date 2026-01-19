'use client';

import Image from 'next/image';

export function EventHeader({
  title,
  imageSrc,
  maxWidthClass = 'max-w-[60rem]',
}: {
  title: string;
  imageSrc: string;
  maxWidthClass?: string;
}) {
  return (
    <div className="flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
      {/* Hero Image Section */}
      <div className="w-full px-8 md:px-12 mt-4 mb-4">
        <div className={`relative aspect-[21/9] md:aspect-[4.5/1] w-full ${maxWidthClass} mx-auto rounded-2xl overflow-hidden shadow-xl border border-white/20 ring-1 ring-black/5 group`}>
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <h1 className="text-white text-xl md:text-3xl font-black tracking-tight drop-shadow-lg max-w-3xl leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full px-8 md:px-12 pb-2">
        <div className={`flex items-center justify-between border-b border-slate-200 pb-3 ${maxWidthClass} mx-auto`}>
          <h2 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
            Community Feed
          </h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors group">
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Latest</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
