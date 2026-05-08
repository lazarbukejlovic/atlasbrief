import { ArrowRight, CheckCircle2, Compass, FileSearch, Lock, Radar, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtlasBrief } from '../components/AppLayout';
import CostIndexChart from '../components/CostIndexChart';
import DashboardCard from '../components/DashboardCard';
import DestinationCard from '../components/DestinationCard';
import HeroPlaneAnimation from '../components/HeroPlaneAnimation';
import ReadinessScore from '../components/ReadinessScore';
import SeoMeta from '../components/SeoMeta';
import { featuredDestinations, getDestinationReadinessScore } from '../data/destinations';

const Home = () => {
  const { isSaved, toggleSaved } = useAtlasBrief();
  const averageReadiness = Math.round(
    featuredDestinations.reduce(
      (sum, destination) => sum + getDestinationReadinessScore(destination),
      0
    ) / featuredDestinations.length
  );

  return (
    <div className="space-y-10">
      <SeoMeta
        title="AtlasBrief | Trip Readiness Assistant"
        description="Know the country before you land. AtlasBrief helps travelers check readiness signals, costs, local rules, risk context, and what changed before booking."
        canonicalPath="/"
      />

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-sky-accent/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-accent shadow-soft">
            Trip Readiness Assistant
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-navy md:text-7xl">
            Know the country <span className="text-gradient">before you land.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-navy-muted md:text-xl">
            Check trip readiness, cost, local rules, risk signals, and what changed before booking.
          </p>
          <p className="max-w-2xl text-sm leading-7 text-navy-muted">
            Built for U.S. outbound travelers, frequent travelers, remote workers, and long-stay planners. AtlasBrief is not an itinerary planner and not official legal advice.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/dossiers" className="btn-primary inline-flex items-center justify-center gap-2">
              Explore dossiers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/destinations" className="btn-secondary inline-flex items-center justify-center">
              Start a readiness check
            </Link>
            <Link to="/compare" className="btn-secondary inline-flex items-center justify-center">
              Compare destinations
            </Link>
            <Link to="/pricing" className="btn-secondary inline-flex items-center justify-center">
              View pricing
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <DashboardCard
              eyebrow="Decision Engine"
              title="Can I go?"
              value="Ready"
              detail="Check whether a destination is practical before you book."
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <DashboardCard
              eyebrow="Cost Clarity"
              title="What will it cost?"
              value="Realistic"
              detail="Understand entry readiness, estimated cost, and local context."
              icon={<Wallet className="h-5 w-5" />}
            />
            <DashboardCard
              eyebrow="Monitoring"
              title="What changed?"
              value="Tracked"
              detail="Monitor rule, safety, and cost shifts before departure."
              icon={<Radar className="h-5 w-5" />}
            />
          </div>
        </div>
        <HeroPlaneAnimation />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">
            <Compass className="h-4 w-4" />
            How AtlasBrief works
          </div>
          <h2 className="mt-2 text-xl font-semibold text-navy">1. Choose a destination</h2>
          <p className="mt-2 text-sm leading-7 text-navy-muted">Start from destination dossiers or interactive briefs to focus your decision set.</p>
        </article>
        <article className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">
            <FileSearch className="h-4 w-4" />
            How AtlasBrief works
          </div>
          <h2 className="mt-2 text-xl font-semibold text-navy">2. Check readiness signals</h2>
          <p className="mt-2 text-sm leading-7 text-navy-muted">Review entry posture, budget expectations, risk signals, and what changed recently.</p>
        </article>
        <article className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">
            <ArrowRight className="h-4 w-4" />
            How AtlasBrief works
          </div>
          <h2 className="mt-2 text-xl font-semibold text-navy">3. Decide before booking</h2>
          <p className="mt-2 text-sm leading-7 text-navy-muted">Save, monitor, compare, generate reports, or plan a longer 30-90 day stay.</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ReadinessScore value={averageReadiness} label="Portfolio readiness" />
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Built for decisions before booking</div>
          <h2 className="mt-3 text-3xl font-semibold text-navy">Not an itinerary planner. A readiness-first planning layer.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Check entry requirements and document readiness before booking.',
              'Compare realistic costs and budget posture across destinations.',
              'Track local rules, risk signals, and practical travel friction.',
              'Save intelligence, monitor changes, and revisit decisions quickly.',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/75 p-4 text-sm leading-7 text-navy-muted">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-sky-soft/80 p-4 text-sm text-navy">
            <Lock className="h-5 w-5 text-sky-accent" />
            Trust and freshness first: source-labeled planning intelligence with conservative wording.
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-card rounded-[1.75rem] border border-sand/30 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">Destination dossiers</div>
          <h2 className="mt-2 text-2xl font-semibold text-navy">Public readiness dossiers for faster discovery</h2>
          <p className="mt-3 text-sm leading-7 text-navy-muted">
            Browse public destination dossiers to evaluate trip-readiness, cost posture, and trust/freshness signals before committing.
          </p>
          <div className="mt-4">
            <Link to="/dossiers" className="inline-flex rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light">
              Browse dossiers
            </Link>
          </div>
        </article>

        <article className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">From quick trips to 90-day stays</div>
          <h2 className="mt-2 text-2xl font-semibold text-navy">Readiness, monitoring, comparison, and stay planning in one product</h2>
          <p className="mt-3 text-sm leading-7 text-navy-muted">
            AtlasBrief supports short-trip checks and extended 30-90 day feasibility planning while keeping official verification guidance explicit.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/reports" className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
              Readiness reports
            </Link>
            <Link to="/stay-planner" className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
              Stay planner
            </Link>
            <Link to="/pricing" className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
              Free to start, Plus for monitoring
            </Link>
          </div>
        </article>
      </section>

      <CostIndexChart destinations={featuredDestinations} />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Featured briefs</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Compare destinations before you decide</h2>
          </div>
          <Link to="/destinations" className="hidden text-sm font-semibold text-navy hover:text-sky-accent sm:inline-flex">
            View all destinations
          </Link>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {featuredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isSaved={isSaved(destination.id)}
              onToggleSaved={toggleSaved}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-sky-accent/10 bg-sky-soft/50 p-5">
        <p className="text-sm leading-relaxed text-navy-muted">
          <span className="font-semibold text-navy">Trust and freshness:</span> AtlasBrief provides planning intelligence snapshots, not official legal or immigration advice. Verify final requirements with official government and airline sources before booking.
        </p>
      </section>
    </div>
  );
};

export default Home;