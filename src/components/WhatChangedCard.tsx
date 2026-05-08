import type { TravelIntelligenceUpdate } from '../data/travelIntelligenceUpdates';

interface WhatChangedCardProps {
  updates: TravelIntelligenceUpdate[];
  emptyMessage?: string;
}

const severityClassMap = {
  info: 'bg-sky-soft text-navy',
  watch: 'bg-amber-100 text-amber-900',
  important: 'bg-rose-100 text-rose-900',
};

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

const WhatChangedCard = ({ updates, emptyMessage = 'No recent static updates.' }: WhatChangedCardProps) => {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">What changed</p>
      {updates.length === 0 ? (
        <p className="mt-3 text-sm text-navy-muted">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {updates.map((update) => (
            <li key={update.id} className="rounded-xl bg-white/80 p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-navy">{update.changeType}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityClassMap[update.severity]}`}>
                  {update.severity}
                </span>
              </div>
              <p className="mt-1 text-navy-muted">{update.message}</p>
              <p className="mt-1 text-xs text-navy-muted">{formatDate(update.date)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WhatChangedCard;
