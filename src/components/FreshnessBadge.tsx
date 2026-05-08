import type { FreshnessStatus } from '../data/destinationTrust';

const freshnessClassMap: Record<FreshnessStatus, string> = {
  current: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'review-soon': 'border-amber-200 bg-amber-50 text-amber-900',
  stale: 'border-rose-200 bg-rose-50 text-rose-900',
};

const freshnessLabelMap: Record<FreshnessStatus, string> = {
  current: 'Current',
  'review-soon': 'Review soon',
  stale: 'Stale',
};

interface FreshnessBadgeProps {
  freshnessStatus: FreshnessStatus;
  compact?: boolean;
}

const FreshnessBadge = ({ freshnessStatus, compact = false }: FreshnessBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 ${compact ? 'py-1 text-[11px]' : 'py-1.5 text-xs'} font-semibold ${freshnessClassMap[freshnessStatus]}`}
  >
    {freshnessLabelMap[freshnessStatus]}
  </span>
);

export default FreshnessBadge;
