import type { DestinationTrustMetadata } from '../data/destinationTrust';

interface DataFreshnessTimelineProps {
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
  });
};

const DataFreshnessTimeline = ({ metadata }: DataFreshnessTimelineProps) => {
  const rows = [
    { label: 'Requirements snapshot', value: metadata.requirementsUpdatedAt },
    { label: 'Cost estimate layer', value: metadata.costDataUpdatedAt },
    { label: 'FX / currency context', value: metadata.fxDataUpdatedAt },
    { label: 'Advisory / risk layer', value: metadata.advisoryUpdatedAt },
  ];

  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Data freshness timeline</p>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-sm">
            <span className="text-navy-muted">{row.label}</span>
            <span className="font-semibold text-navy">{formatDate(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataFreshnessTimeline;
