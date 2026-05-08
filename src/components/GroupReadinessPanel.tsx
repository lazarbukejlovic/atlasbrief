const GroupReadinessPanel = () => (
  <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Group Trip Readiness</div>
    <h2 className="mt-2 text-2xl font-semibold text-navy">Coordinate readiness across travelers</h2>
    <p className="mt-2 text-sm leading-7 text-navy-muted">
      Pro is designed to help families and small groups keep shared planning context, compare destination decisions together,
      and monitor reminders before committing.
    </p>

    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Shared checklist</p>
        <p className="mt-2 text-sm font-semibold text-navy">One checklist across trip members</p>
      </article>
      <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Readiness summaries</p>
        <p className="mt-2 text-sm font-semibold text-navy">Export summary previews for alignment</p>
      </article>
      <article className="rounded-2xl border border-white/70 bg-white/85 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Longer trip planning</p>
        <p className="mt-2 text-sm font-semibold text-navy">Extended history for compare and stay planning</p>
      </article>
    </div>
  </section>
);

export default GroupReadinessPanel;