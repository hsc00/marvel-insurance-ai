export function BoundaryFallback({ onRetry }: Readonly<{ onRetry: () => void }>) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-xl border border-border bg-gray-900 shadow-sm p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-100">Something went wrong</h1>
        <p className="text-sm text-gray-400">
          The claims review interface ran into an unexpected problem. Refreshing the page will
          restore the dashboard.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
