import { useMemo, useState } from 'react';
import ComingSoonBadge from './ComingSoonBadge';
import { getProInterestRecord, saveProInterestRecord } from '../utils/proInterest';

interface ProInterestCardProps {
  compact?: boolean;
}

const ProInterestCard = ({ compact = false }: ProInterestCardProps) => {
  const [refreshTick, setRefreshTick] = useState(0);
  const record = useMemo(() => getProInterestRecord(), [refreshTick]);

  const handleInterest = () => {
    saveProInterestRecord();
    setRefreshTick((current) => current + 1);
  };

  return (
    <section className={`glass-card rounded-[1.75rem] border border-sand/40 ${compact ? 'p-5' : 'p-6'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Coming soon CTA</div>
          <h2 className={`${compact ? 'mt-1 text-xl' : 'mt-2 text-2xl'} font-semibold text-navy`}>Join Pro waitlist preview</h2>
          <p className="mt-2 text-sm text-navy-muted">
            Pro checkout is not available yet. Register interest locally for this prototype.
          </p>
        </div>
        <ComingSoonBadge label="Checkout disabled" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleInterest}
          className="rounded-2xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light"
        >
          Join Pro waitlist
        </button>

        {record ? (
          <p className="text-sm text-navy-muted">
            You're on the local Pro interest list for this prototype.
          </p>
        ) : (
          <p className="text-sm text-navy-muted">No backend submission in this phase.</p>
        )}
      </div>
    </section>
  );
};

export default ProInterestCard;