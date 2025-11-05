'use client';

interface SessionCardProps {
  imageSrc: string;
  title: string;
}

export function SessionCard({ imageSrc, title }: SessionCardProps) {
  return (
    <div className="w-64 rounded-lg overflow-hidden mb-0 pl-1">
      <img
        src={imageSrc || '/placeholder.svg'}
        alt={title}
        className="w-[calc(100%-0.4rem)] ml-4 rounded-md object-cover"
      />
    </div>
  );
}
