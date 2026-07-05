import { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Claim, ClaimFiltersApplied } from './types/claims';
import { useClaimsQuery } from './hooks/useClaimsQuery';
import { useClaimsSSE } from './hooks/useClaimsSSE';
import { ClaimsTable } from './components/ClaimsTable';
import { FilterBar } from './components/FilterBar';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { useDebounce } from './hooks/useDebounce';
import { HighlightedClaimContext } from './hooks/useHighlightedClaim';

const queryClient = new QueryClient();

const SEARCH_DEBOUNCE_MS = 300;
const HIGHLIGHT_TIMEOUT_MS = 1500;

function ClaimsReviewContent() {
  const [filters, setFilters] = useState<ClaimFiltersApplied>({
    status: null,
    priority: null,
    search: null,
  });

  const debouncedSearch = useDebounce(filters.search, SEARCH_DEBOUNCE_MS);

  const { data, isLoading, isError, error, refetch } = useClaimsQuery({
    ...filters,
    search: debouncedSearch,
  });
  const {
    lastEvent,
    error: sseError,
    retry: sseRetry,
  } = useClaimsSSE({
    ...filters,
    search: debouncedSearch,
  });
  const [mergedClaims, setMergedClaims] = useState<Claim[]>([]);
  const [hasInitialBatch, setHasInitialBatch] = useState(false);
  const [highlightedClaimId, setHighlightedClaimId] = useState<string | null>(null);

  // Reset SSE when filters change so new query data can flow in
  // until the new stream's initial_batch arrives.
  useEffect(() => {
    setHasInitialBatch(false);
  }, [filters.status, filters.priority, debouncedSearch]);

  // Sync with TanStack Query data when it changes, but only until
  // the SSE initial_batch arrives and takes precedence.
  useEffect(() => {
    if (data?.items && !hasInitialBatch) {
      setMergedClaims(data.items);
    }
  }, [data?.items, hasInitialBatch]);

  // Apply SSE events.
  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.type === 'initial_batch') {
      setHasInitialBatch(true);
      setMergedClaims(lastEvent.data.items);
    } else if (lastEvent.type === 'claim_update') {
      setMergedClaims(prev =>
        prev.map(claim => (claim.id === lastEvent.data.id ? lastEvent.data : claim))
      );
      setHighlightedClaimId(lastEvent.data.id);
    }
  }, [lastEvent]);

  useEffect(() => {
    if (!highlightedClaimId) return;
    const timer = setTimeout(() => setHighlightedClaimId(null), HIGHLIGHT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [highlightedClaimId]);

  const hasExistingData = mergedClaims.length > 0;

  const highlightedClaimContextValue = useMemo(
    () => ({ highlightedClaimId }),
    [highlightedClaimId]
  );

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
            <FilterBar filters={filters} onFiltersChange={setFilters} />

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
                  <ClaimsTable claims={mergedClaims} />
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
