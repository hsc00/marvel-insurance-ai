interface ErrorStateProps {
  readonly error: Error | null;
  readonly onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: Readonly<ErrorStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" role="alert">
      <div
        className="w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-base font-medium text-gray-100 mb-1">Unable to load claims</h3>
      <p className="text-sm text-gray-400 mb-4 text-center max-w-sm">
        {error?.message || 'An unexpected error occurred while loading claims.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all"
          aria-label="Retry loading claims"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <polyline
              points="23,4 23,10 17,10"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12,4c5.5,0 10,4.5 10,10s-4.5,10 -10,10s-10,-4.5 -10,-10S6.5,4 12,4z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
