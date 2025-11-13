import Image from "next/image";

export function EventHeader({
  title,
  imageSrc,
}: {
  title: string;
  imageSrc: string;
}) {
  return (
    <div className="flex flex-col bg-gray-50 h-full">
      <div className="relative w-[800px] h-56 sm:h-44 mx-auto mt-8 mb-2 pl-6 pr-12 sm:pl-8 sm:pr-14">
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
          <h1 className="absolute bottom-4 left-6 sm:left-8 text-white text-3xl sm:text-2xl font-bold tracking-wide drop-shadow-md">
            {title}
          </h1>
        </div>
      </div>

      <div className="px-10 pt-4 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Event Updates</h2>
      </div>
    </div>
  );
}
