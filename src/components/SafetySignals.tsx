import { ShieldCheck, ShieldEllipsis, ShieldX } from 'lucide-react';

interface SafetySignalsProps {
  score: number;
  notes: string[];
}

const SafetySignals = ({ score, notes }: SafetySignalsProps) => {
  const Icon = score >= 85 ? ShieldCheck : score >= 70 ? ShieldEllipsis : ShieldX;
  const toneClass = score >= 85 ? 'text-success' : score >= 70 ? 'text-warning' : 'text-danger';

  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Safety signals</div>
          <h3 className="mt-3 text-2xl font-semibold text-navy">Ground reality, not brochure copy</h3>
        </div>
        <Icon className={`h-8 w-8 ${toneClass}`} />
      </div>
      <div className="mt-6 flex items-end gap-4">
        <div className="text-5xl font-semibold tracking-tight text-navy">{score}</div>
        <div className="pb-1 text-sm text-navy-muted">Safety confidence score</div>
      </div>
      <div className="mt-6 space-y-3">
        {notes.map((note) => (
          <div key={note} className="rounded-2xl bg-white/75 px-4 py-3 text-sm leading-7 text-navy-muted">
            {note}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SafetySignals;