import ComingSoonBadge from './ComingSoonBadge';

const ProPreviewHero = () => (
  <section className="glass-card rounded-[2rem] border border-sky-accent/20 p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Pro Preview</div>
      <ComingSoonBadge />
    </div>

    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
      AtlasBrief Pro is built for serious trips, families, and longer stays.
    </h1>
    <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
      Plan with more context, share readiness signals, compare decisions, and prepare for longer trips before committing.
    </p>
  </section>
);

export default ProPreviewHero;