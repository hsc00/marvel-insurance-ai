export const STATUS_CONFIG = {
  pending: { label: 'Pending', classes: 'bg-yellow-900/20 text-yellow-300' },
  in_review: { label: 'In Review', classes: 'bg-blue-900/20 text-blue-300' },
  approved: { label: 'Approved', classes: 'bg-green-900/20 text-green-300' },
  denied: { label: 'Denied', classes: 'bg-red-900/20 text-red-300' },
} as const;

export type ClaimStatus = keyof typeof STATUS_CONFIG;

export function getStatusConfig(status: string): { label: string; classes: string } {
  return (
    STATUS_CONFIG[status as ClaimStatus] ?? {
      label: status,
      classes: 'bg-gray-900/20 text-gray-300',
    }
  );
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
