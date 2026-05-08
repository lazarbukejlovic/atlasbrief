import { Link } from 'react-router-dom';
import FamilySharingPreview from '../components/FamilySharingPreview';
import GroupReadinessPanel from '../components/GroupReadinessPanel';
import MonetizationDisclosure from '../components/MonetizationDisclosure';
import PlanLimitComparison from '../components/PlanLimitComparison';
import ProFeatureCard from '../components/ProFeatureCard';
import ProInterestCard from '../components/ProInterestCard';
import ProPreviewHero from '../components/ProPreviewHero';

const proFeatures = [
  {
    title: '20 saved trips',
    description: 'Keep a deeper backlog of destination readiness plans for multi-leg and repeat travel decisions.',
  },
  {
    title: 'Family / group trip workspace',
    description: 'Preview shared planning context so multiple travelers can review readiness before booking.',
  },
  {
    title: 'Shared readiness checklist',
    description: 'Track checklist progress across travelers with reminder placeholders for trip-critical items.',
  },
  {
    title: 'Destination compare history',
    description: 'Retain compare sessions to revisit prior decision rationale across trip planning cycles.',
  },
  {
    title: 'Long-stay planning history',
    description: 'Keep broader 30–90 day feasibility history as trip options evolve.',
  },
  {
    title: 'Advanced alert monitoring',
    description: 'Preview deeper monitoring layers for watch and important changes across tracked destinations.',
  },
  {
    title: 'Exportable readiness summary',
    description: 'Generate shareable readiness summaries for family planning and group trip alignment.',
  },
  {
    title: 'Priority freshness review',
    description: 'Prioritize destination freshness review queues in high-intent planning windows.',
  },
  {
    title: 'Partner redirect insights',
    description: 'See higher-level redirect intent patterns to support next-step planning decisions.',
  },
  {
    title: 'Future B2B/group travel tools',
    description: 'Planned workspace capabilities for agency and team-oriented readiness coordination.',
  },
];

const Pro = () => {
  return (
    <div className="space-y-8">
      <ProPreviewHero />

      <MonetizationDisclosure compact />

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Pro feature preview</div>
        <h2 className="mt-2 text-2xl font-semibold text-navy">What Pro is designed to unlock</h2>
        <p className="mt-2 text-sm text-navy-muted">
          Preview-level product surface only. Pro checkout is intentionally disabled in this phase.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proFeatures.map((feature) => (
            <ProFeatureCard key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </div>
      </section>

      <FamilySharingPreview />

      <GroupReadinessPanel />

      <PlanLimitComparison />

      <ProInterestCard />

      <section className="glass-card rounded-[1.75rem] border border-sand/40 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Conservative note</div>
        <h2 className="mt-2 text-2xl font-semibold text-navy">Pro is a polished preview, not active checkout</h2>
        <p className="mt-2 text-sm leading-7 text-navy-muted">
          AtlasBrief Pro is presented as a coming-soon upgrade path. Continue using Free or Plus today, and review official requirements before travel decisions.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/pricing" className="rounded-2xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light">
            Return to pricing
          </Link>
          <Link to="/dashboard" className="rounded-2xl border border-white/70 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pro;