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
      className="flex flex-col items-center m-3 cursor-pointer transition-transform hover:scale-[1.02] rounded-lg w-full"
    >
      <div className="w-full h-[300px] rounded-[12px] bg-white shadow-md p-6 flex flex-col items-center justify-center border border-gray-100">
        <Image
          src={imageSrc || '/images/placeholder.png'}
          alt={name}
          width={400}
          height={200}
          className="object-contain max-h-full"
        />
      </div>
      <div className="mt-3 text-center text-base font-semibold text-gray-800">
        {name}
      </div>
    </div>
  );
}
