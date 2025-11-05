'use client';

interface SessionCardProps {
  imageSrc: string;
  title: string;
}

export function SessionCard({ imageSrc, title }: SessionCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white">
      <img
        src={imageSrc || '/placeholder.svg'}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <div className="p-3 bg-gray-50">
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      </div>
    </div>
  );
}
