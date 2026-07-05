import type { ClaimFiltersApplied } from '../types/claims';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/filterOptions';

interface FilterBarProps {
  readonly filters: ClaimFiltersApplied;
  readonly onFiltersChange: (filters: ClaimFiltersApplied) => void;
}

export function FilterBar({ filters, onFiltersChange }: Readonly<FilterBarProps>) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      status: (e.target.value === '' ? null : e.target.value) as ClaimFiltersApplied['status'],
    });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      priority: (e.target.value === '' ? null : e.target.value) as ClaimFiltersApplied['priority'],
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value || null });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap px-4 py-3">
      <div className="relative w-full sm:flex-1 min-w-0">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="search"
          type="text"
          placeholder="Search claims..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="h-9 w-full rounded-lg border border-border bg-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 pl-10 pr-3"
          aria-label="Search claims"
        />
      </div>

      <div className="h-px w-full sm:h-9 sm:w-px bg-white/10" aria-hidden="true" />

      <label htmlFor="status" className="sr-only">
        Status
      </label>
      <select
        id="status"
        name="status"
        value={filters.status || ''}
        onChange={handleStatusChange}
        className="h-9 sm:w-40 appearance-none rounded-lg border border-border bg-gray-800 pl-3 pr-8 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        id="priority"
        name="priority"
        value={filters.priority || ''}
        onChange={handlePriorityChange}
        className="h-9 sm:w-40 appearance-none rounded-lg border border-border bg-gray-800 pl-3 pr-8 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label="Filter by priority"
      >
        {PRIORITY_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
