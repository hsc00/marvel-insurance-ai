export function LoadingState() {
  return (
    <output
      className="flex flex-col items-center justify-center py-16 px-4"
      aria-label="Loading claims"
    >
      <div className="relative" aria-hidden="true">
        <div className="w-10 h-10 border-2 border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-gray-400">Loading claims...</p>
    </output>
  );
}
