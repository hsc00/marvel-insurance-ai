import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../components/FilterBar';
import type { ClaimFiltersApplied } from '../types/claims';

const baseFilters: ClaimFiltersApplied = {
  status: null,
  sort: 'updated_at',
  search: null,
};

describe('FilterBar', () => {
  it('renders search, status, and sort controls', () => {
    render(<FilterBar filters={baseFilters} onFiltersChange={() => {}} />);

    expect(screen.getByLabelText('Search claims')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort claims')).toBeInTheDocument();
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

  it('calls onFiltersChange with updated sort', () => {
    const onChange = vi.fn();
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Sort claims'), {
      target: { value: 'confidence' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseFilters,
      sort: 'confidence',
    });
  });

  it('calls onFiltersChange with null sort when default option selected', () => {
    const onChange = vi.fn();
    render(<FilterBar filters={baseFilters} onFiltersChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Sort claims'), {
      target: { value: '' },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...baseFilters,
      sort: null,
    });
  });
});
