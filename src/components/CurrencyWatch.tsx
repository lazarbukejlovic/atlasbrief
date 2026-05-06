import { ArrowUpRight } from 'lucide-react';
import type { Destination } from '../data/destinations';

interface CurrencyWatchProps {
  destination: Destination;
}

const CurrencyWatch = ({ destination }: CurrencyWatchProps) => {
  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Currency watch</div>
          <h3 className="mt-3 text-2xl font-semibold text-navy">{destination.currency}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sand shadow-soft">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-navy-muted">{destination.exchangeNote}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-white/80 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Budget fit</div>
          <div className="mt-2 text-lg font-semibold text-navy">{destination.costLevel}</div>
        </div>
        <div className="rounded-2xl bg-white/80 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Monthly cost</div>
          <div className="mt-2 text-lg font-semibold text-navy">${destination.monthlyCostEstimate.toLocaleString()}</div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyWatch;