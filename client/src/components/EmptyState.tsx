export function EmptyState() {
  return (
    <output
      className="flex flex-col items-center justify-center py-16 px-4"
      aria-label="No claims found"
    >
      <div
        className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
          <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-base font-medium text-gray-100 mb-1">No claims found</h3>
      <p className="text-sm text-gray-400 text-center max-w-sm">
        No claims match your current filter criteria. Try adjusting your filters or check back
        later.
      </p>
    </output>
  );
}
