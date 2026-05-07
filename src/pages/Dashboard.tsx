import { Bookmark, Globe2, PlaneTakeoff, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtlasBrief } from '../components/AppLayout';
import CostIndexChart from '../components/CostIndexChart';
import CurrencyWatch from '../components/CurrencyWatch';
import DashboardCard from '../components/DashboardCard';
import TripProfileCard from '../components/TripProfileCard';
import UserPlanBadge from '../components/UserPlanBadge';
import { getDestinationReadinessScore, destinations as allDestinations } from '../data/destinations';
import { getRelativeUpdateLabel } from '../data/watchlistSignals';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { destinations, savedIds, savedLimit, watchlist, watchlistIds } = useAtlasBrief();
  const { isAuthenticated, currentPlan } = useAuth();

  const savedDestinations = destinations.filter((destination) => savedIds.includes(destination.id));
  const watchlistPreview = watchlist.slice(0, 3);
  const strongestWatchSignal = [...watchlist].sort((left, right) => {
    const severityRank = { elevated: 3, watch: 2, low: 1 };
    return (severityRank[right.severity as keyof typeof severityRank] ?? 0) - (severityRank[left.severity as keyof typeof severityRank] ?? 0);
  })[0] ?? null;
  const strongestReadiness = [...destinations].sort(
    (left, right) => getDestinationReadinessScore(right) - getDestinationReadinessScore(left)
  )[0];
  const leanestDestination = [...destinations].sort(
    (left, right) => left.monthlyCostEstimate - right.monthlyCostEstimate
  )[0];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Trip Planning</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
            {isAuthenticated ? 'Your Trip Readiness Workspace' : 'Trip Readiness Workspace'}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
            {isAuthenticated
              ? 'Monitor your saved destinations, compare costs, and track what changed before you book.'
              : 'Monitor your saved destinations, compare costs, and track what changed before you book. Sign in to keep your workspace across devices.'}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <UserPlanBadge plan={currentPlan} />
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft">
              Saved briefs: {savedIds.length}/{savedLimit === 'Custom' ? 'Custom' : savedLimit}
            </span>
          </div>
        </div>
        <Link to="/destinations" className="btn-secondary inline-flex items-center justify-center lg:w-auto">
          Add more destinations
        </Link>
      </section>

      {!isAuthenticated ? (
        <section className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Account-ready workspace</div>
          <h2 className="mt-3 text-2xl font-semibold text-navy">
            Sign in to turn your saved destinations into a persistent readiness workspace.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-navy-muted">
            Create your readiness workspace, save trip briefs across devices, and unlock plan-based limits when billing is enabled.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/login" className="btn-secondary px-5 py-2.5 text-sm">
              Login
            </Link>
            <Link to="/signup" className="btn-primary px-5 py-2.5 text-sm">
              Sign up
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          eyebrow="Saved briefs"
          title="Saved readiness briefs"
          value={String(savedIds.length)}
          detail="Trip readiness briefs you can reopen quickly before making a booking call."
          icon={<Bookmark className="h-5 w-5" />}
        />
        <DashboardCard
          eyebrow="Best readiness"
          title={strongestReadiness.city}
          value={`${getDestinationReadinessScore(strongestReadiness)}`}
          detail="Highest combined readiness score in the current destination set."
          icon={<Signal className="h-5 w-5" />}
        />
        <DashboardCard
          eyebrow="Best value"
          title={leanestDestination.city}
          value={`$${leanestDestination.monthlyCostEstimate.toLocaleString()}`}
          detail="Most budget-friendly option for extended monthly stays."
          icon={<Globe2 className="h-5 w-5" />}
        />
        <DashboardCard
          eyebrow="Travel mode"
          title="Business + remote"
          value="2 lanes"
          detail="Designed for business travelers and remote workers evaluating fit."
          icon={<PlaneTakeoff className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CostIndexChart destinations={destinations.slice(0, 6)} />
        <CurrencyWatch destination={strongestReadiness} />
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Watchlist Intelligence</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Signals across tracked destinations</h2>
            {strongestWatchSignal ? (
              <p className="mt-2 text-sm text-navy-muted">
                Strongest signal: {strongestWatchSignal.safety_signal} | {strongestWatchSignal.last_updated_label}
              </p>
            ) : (
              <p className="mt-2 text-sm text-navy-muted">
                Monitor destination movement before you book. Your watchlist highlights live travel-readiness signals.
              </p>
            )}
          </div>
          <Link to="/watchlist" className="btn-secondary inline-flex items-center justify-center px-5 py-2.5 text-sm">
            Open Watchlist
          </Link>
        </div>

        {watchlistPreview.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-navy-muted">
            <p className="font-semibold text-navy">No watched destinations yet</p>
            <p className="mt-2">Start a destination watchlist to monitor signals before you commit to flights or lodging.</p>
            <Link to="/destinations" className="mt-4 inline-flex rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light">
              Explore destinations
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {watchlistPreview.map((item) => (
              <article key={item.id ?? item.destination_id} className="rounded-2xl border border-white/70 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">{item.country}</p>
                <h3 className="mt-2 text-lg font-semibold text-navy">{item.destination_name}</h3>
                <p className="mt-3 text-sm text-navy-muted">{item.safety_signal}</p>
                <p className="mt-2 text-xs text-navy-muted">{item.last_updated_label}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Saved Briefs</div>
              <h2 className="mt-3 text-3xl font-semibold text-navy">Saved trip readiness briefs</h2>
          </div>
          <Link to="/saved" className="text-sm font-semibold text-navy hover:text-sky-accent">
            Open Saved Briefs
          </Link>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {(savedDestinations.length > 0 ? savedDestinations : allDestinations.slice(0, 2)).map((destination) => (
            <TripProfileCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;