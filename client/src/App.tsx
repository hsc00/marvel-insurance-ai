import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ClaimFiltersApplied } from './types/claims';
import { useClaimsQuery } from './hooks/useClaimsQuery';
import { ClaimsTable } from './components/ClaimsTable';
import { FilterBar } from './components/FilterBar';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';

const queryClient = new QueryClient();

function ClaimsReviewContent() {
  const [filters, setFilters] = useState<ClaimFiltersApplied>({
    status: null,
    priority: null,
    search: null,
  });

  const { data, isLoading, isError, error, refetch } = useClaimsQuery(filters);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-100">
                Agent Workflows
              </h1>{' '}
            </div>
            <p className="text-sm text-gray-400">AI-powered claims review</p>
          </div>

          <div className="rounded-xl border border-border bg-gray-900 shadow-sm">
            <FilterBar filters={filters} onFiltersChange={setFilters} />

            {isLoading && (
              <div className="p-6" aria-busy="true" aria-live="polite">
                <LoadingState />
              </div>
            )}

            {isError && (
              <div className="p-6" role="alert" aria-live="assertive">
                <ErrorState
                  error={error instanceof Error ? error : null}
                  onRetry={() => refetch()}
                />
              </div>
            )}

            {!isLoading && !isError && data && data.items.length === 0 && <EmptyState />}

            {!isLoading && !isError && data && data.items.length > 0 && (
              <ClaimsTable claims={data.items} />
            )}
          </div>
        </div>
      </div>
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
