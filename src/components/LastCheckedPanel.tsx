import type { DestinationTrustMetadata } from '../data/destinationTrust';
import FreshnessBadge from './FreshnessBadge';

interface LastCheckedPanelProps {
  metadata: DestinationTrustMetadata;
}

const formatDate = (value: string) => {
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const LastCheckedPanel = ({ metadata }: LastCheckedPanelProps) => (
  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Freshness</p>
      <FreshnessBadge freshnessStatus={metadata.freshnessStatus} compact />
    </div>
    <p className="mt-3 text-sm text-navy-muted">Last checked</p>
    <p className="text-base font-semibold text-navy">{formatDate(metadata.lastCheckedAt)}</p>
    <p className="mt-3 text-sm text-navy-muted">Next review due</p>
    <p className="text-base font-semibold text-navy">{formatDate(metadata.nextReviewDue)}</p>
  </div>
);

export default LastCheckedPanel;
