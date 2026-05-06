import { CheckCircle2 } from 'lucide-react';

interface TravelChecklistProps {
  items: string[];
}

const TravelChecklist = ({ items }: TravelChecklistProps) => {
  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Travel checklist</div>
      <h3 className="mt-3 text-2xl font-semibold text-navy">Departure prep that avoids avoidable issues</h3>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <label key={item} className="flex items-start gap-3 rounded-2xl bg-white/75 p-4 text-sm leading-7 text-navy-muted">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-success" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default TravelChecklist;