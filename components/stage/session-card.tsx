'use client';

interface SessionCardProps {
  imageSrc: string;
  title: string;
  className?: string;
}

export function SessionCard({ imageSrc, title, className }: SessionCardProps) {
  return (
    <div className={`w-full flex justify-center px-2 py-2 ${className}`}>
      <div className="w-full max-w-3xl shadow-md border rounded-xl overflow-hidden">
        <img
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
