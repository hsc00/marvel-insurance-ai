export const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Sort: Date' },
  { value: 'confidence', label: 'Sort: Confidence' },
  { value: 'claimant_name', label: 'Sort: Name' },
  { value: 'status', label: 'Sort: Status' },
] as const;

export type FilterStatusValue = (typeof STATUS_OPTIONS)[number]['value'];
export type FilterPriorityValue = (typeof PRIORITY_OPTIONS)[number]['value'];
export type FilterSortValue = (typeof SORT_OPTIONS)[number]['value'];
