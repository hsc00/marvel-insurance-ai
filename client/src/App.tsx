import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClaimsTable } from './components/ClaimsTable';
import { FilterBar } from './components/FilterBar';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { HighlightedClaimContext } from './hooks/useHighlightedClaim';
import { useClaimsViewModel } from './hooks/useClaimsViewModel';

const queryClient = new QueryClient();

function ClaimsReviewContent() {
  const {
    filters,
    onFiltersChange,
    isLoading,
    isError,
    error,
    refetch,
    sseError,
    sseRetry,
    mergedClaims,
    sortedClaims,
    hasExistingData,
    highlightedClaimContextValue,
  } = useClaimsViewModel();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>
      <main className="mx-auto max-w-7xl px-4 py-8" id="main-content">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-100">
                Agent Workflows
              </h1>
            </div>
            <p className="text-sm text-gray-400">AI-powered claims review</p>
          </div>

          <div className="rounded-xl border border-border bg-gray-900 shadow-sm">
            <FilterBar filters={filters} onFiltersChange={onFiltersChange} />

            {isLoading && !hasExistingData && (
              <div className="p-6" aria-busy="true" aria-live="polite">
                <LoadingState />
              </div>
            )}

            {isError && !hasExistingData && (
              <div className="p-6" role="alert" aria-live="assertive">
                <ErrorState
                  error={error instanceof Error ? error : null}
                  onRetry={() => refetch()}
                />
              </div>
            )}

            {sseError && hasExistingData && (
              <div
                className="px-6 py-3 bg-red-900/10 border-t border-border"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-red-400">{sseError}</p>
                  <button
                    onClick={sseRetry}
                    className="inline-flex items-center px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all whitespace-nowrap"
                    aria-label="Retry live stream connection"
                  >
                    Reconnect
                  </button>
                </div>
              </div>
            )}

            <div aria-live="polite" aria-atomic="true">
              {mergedClaims.length === 0 && !isLoading && !isError && <EmptyState />}
              {mergedClaims.length > 0 && (
                <HighlightedClaimContext.Provider value={highlightedClaimContextValue}>
                  <ClaimsTable claims={sortedClaims} />
                </HighlightedClaimContext.Provider>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClaimsReviewContent />
    </QueryClientProvider>
  );
}

export default App;
