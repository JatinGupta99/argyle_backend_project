export default function CenteredMessage({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <p className={`text-lg font-medium text-gray-700 ${className}`}>
        {children}
      </p>
    </div>
  );
}
