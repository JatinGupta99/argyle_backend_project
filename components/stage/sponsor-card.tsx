'use client';

import Image from 'next/image';

type SponsorCardProps = {
  imageSrc: string;
  name: string;
  onClick?: () => void;
};

export function SponsorCard({ imageSrc, name, onClick }: SponsorCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center group cursor-pointer transition-all hover:-translate-y-1 duration-300 w-full"
    >
      <div className="w-full aspect-[4/3] rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow p-8 flex items-center justify-center border border-border">
        <Image
          src={imageSrc || '/images/placeholder.png'}
          alt={name}
          width={400}
          height={300}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="mt-4 text-center text-lg font-bold text-[#000000] group-hover:text-blue-600 transition-colors">
        {name}
      </div>
    </div>
  );
}
