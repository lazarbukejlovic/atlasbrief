interface ReadinessScoreProps {
  value: number;
  label?: string;
}

const getReadinessTone = (value: number) => {
  if (value >= 90) {
    return 'Excellent';
  }
  if (value >= 80) {
    return 'Strong';
  }
  if (value >= 70) {
    return 'Watchlist';
  }
  return 'Plan carefully';
};

const ReadinessScore = ({ value, label = 'Destination readiness' }: ReadinessScoreProps) => {
  const angle = (value / 100) * 360;

  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">{label}</div>
      <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        <div
          className="flex h-36 w-36 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#3B82F6 ${angle}deg, rgba(255,255,255,0.9) ${angle}deg 360deg)`,
          }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-ivory">
            <span className="text-4xl font-semibold text-navy">{value}</span>
            <span className="text-xs uppercase tracking-[0.22em] text-navy-muted">out of 100</span>
          </div>
        </div>
        <div className="max-w-sm">
          <div className="text-2xl font-semibold text-navy">{getReadinessTone(value)}</div>
          <p className="mt-3 text-sm leading-7 text-navy-muted">
            AtlasBrief weights safety, connectivity, and movement quality to surface how easy a destination is to operate in before you even book.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReadinessScore;