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
      className="flex flex-col items-center m-3 cursor-pointer transition-transform hover:scale-[1.02] rounded-lg"
    >
      <div className="w-[280px] h-[180px] rounded-[8px] bg-white shadow p-4 flex flex-col items-center justify-center">
        <Image
          src={imageSrc || '/images/placeholder.png'}
          alt={name}
          width={260}
          height={100}
          className=""
        />
      </div>
      <div className="mt-3 text-center text-base font-semibold text-gray-800">
        {name}
      </div>
    </div>
  );
}
