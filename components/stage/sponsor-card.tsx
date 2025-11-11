type SponsorCardProps = {
  imageSrc: string;
  name: string;
};

export function SponsorCard({ imageSrc, name }: SponsorCardProps) {
  return (
    <div className="flex flex-col items-center m-2">
      <div className="w-[280px] h-[170px] rounded-[8px] bg-white shadow p-4 flex flex-col items-center">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-[100px] object-contain mb-2 m-6"
        />
      </div>
      <div className="mt-3 text-center text-base font-semibold text-gray-800">
        {name}
      </div>
    </div>
  );
}
