import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../components/FilterBar';
import type { ClaimFiltersApplied } from '../types/claims';

const baseFilters: ClaimFiltersApplied = {
  status: null,
  priority: null,
  search: null,
};

describe('FilterBar', () => {
  it('renders search, status, and priority controls', () => {
    render(<FilterBar filters={baseFilters} onFiltersChange={() => {}} />);

    expect(screen.getByLabelText('Search claims')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by priority')).toBeInTheDocument();
  });

  it('calls onFiltersChange with updated status', () => {
    const onChange = vi.fn();
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Filter by status'), {
      target: { value: 'pending' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseFilters,
      status: 'pending',
    });
  });

  it('calls onFiltersChange with updated search', () => {
    const onChange = vi.fn();
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Search claims'), {
      target: { value: 'vehicle' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseFilters,
      search: 'vehicle',
    });
  });
});
