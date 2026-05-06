interface DailyBriefCardProps {
  items: string[];
}

const DailyBriefCard = ({ items }: DailyBriefCardProps) => {
  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Daily brief</div>
      <h3 className="mt-3 text-2xl font-semibold text-navy">What changes how the day actually runs</h3>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm leading-7 text-navy-muted">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyBriefCard;