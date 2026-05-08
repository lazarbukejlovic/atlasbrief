import { BellRing, Bookmark, Globe2, PlaneTakeoff, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtlasBrief } from '../components/AppLayout';
import CostIndexChart from '../components/CostIndexChart';
import CurrencyWatch from '../components/CurrencyWatch';
import DashboardCard from '../components/DashboardCard';
import FreshnessBadge from '../components/FreshnessBadge';
import TripProfileCard from '../components/TripProfileCard';
import UserPlanBadge from '../components/UserPlanBadge';
import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { getDestinationReadinessScore, destinations as allDestinations } from '../data/destinations';
import { getRelativeUpdateLabel } from '../data/watchlistSignals';
import { getRecentIntelligenceUpdates } from '../data/travelIntelligenceUpdates';
import { useAlerts } from '../hooks/useAlerts';
import { useStayPlans } from '../hooks/useStayPlans';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { destinations, savedIds, savedLimit, watchlist, watchlistIds } = useAtlasBrief();
  const { isAuthenticated, currentPlan } = useAuth();
  const { stayPlans } = useStayPlans();
  const { latestActiveAlerts, unreadCount } = useAlerts();

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
  const recentStayPlans = stayPlans.slice(0, 3);
  const intelligenceSourceIds = Array.from(
    new Set([...watchlist.map((item) => item.destination_id), ...savedDestinations.map((destination) => destination.id)])
  );
  const recentIntelligence = getRecentIntelligenceUpdates(intelligenceSourceIds, 5);

  const formatPlanDate = (value: string) => {
    const parsed = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) {
      return 'Unknown date';
    }

    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatUpdateDate = (value: string) => {
    const parsed = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) {
      return 'Unknown date';
    }

    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const severityClassMap = {
    info: 'bg-sky-soft text-navy',
    watch: 'bg-amber-100 text-amber-900',
    important: 'bg-rose-100 text-rose-900',
  };

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

      <section className="glass-card rounded-[1.75rem] border border-sand/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Pro Preview</div>
            <h2 className="mt-1 text-xl font-semibold text-navy">Family sharing and advanced trip history</h2>
            <p className="mt-1 text-sm text-navy-muted">
              Family sharing, longer trip history, and advanced readiness exports are planned for Pro.
            </p>
          </div>
          <Link to="/pro" className="rounded-2xl border border-white/70 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
            View Pro preview
          </Link>
        </div>
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
                {(() => {
                  const trust = getDestinationTrustMetadata(item.destination_id);
                  return trust ? (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <FreshnessBadge freshnessStatus={trust.freshnessStatus} compact />
                      <span className="text-[11px] text-navy-muted">
                        Next review: {new Date(trust.nextReviewDue).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ) : null;
                })()}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Travel Intelligence Updates</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">What changed since last check</h2>
            <p className="mt-2 text-sm text-navy-muted">
              Static demo update feed across your watched and saved destinations.
            </p>
          </div>
          <Link to="/watchlist" className="btn-secondary inline-flex items-center justify-center px-5 py-2.5 text-sm">
            Open Watchlist
          </Link>
        </div>

        {recentIntelligence.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy-muted">
            No recent intelligence updates yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentIntelligence.map((update) => (
              <article key={update.id} className="rounded-2xl border border-white/70 bg-white/85 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-accent">{update.destinationName}</p>
                    <h3 className="mt-1 text-base font-semibold text-navy">{update.changeType}</h3>
                    <p className="mt-1 text-sm text-navy-muted">{update.message}</p>
                    <p className="mt-2 text-xs text-navy-muted">{formatUpdateDate(update.date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClassMap[update.severity]}`}>
                      {update.severity}
                    </span>
                    <Link
                      to={`/destinations/${update.destinationId}`}
                      className="text-xs font-semibold text-navy hover:text-sky-accent"
                    >
                      Open destination
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sand/40 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">Travel alerts</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Active alerts across your monitored destinations</h2>
            <p className="mt-2 text-sm text-navy-muted">
              Latest unread, watch, and important alerts surfaced from your saved briefs, watchlist, and stay plans.
            </p>
          </div>
          <Link to="/alerts" className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm">
            <BellRing className="h-4 w-4" />
            Open alerts {unreadCount > 0 ? `(${unreadCount})` : ''}
          </Link>
        </div>

        {latestActiveAlerts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy-muted">
            No active alerts right now.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {latestActiveAlerts.map((alert) => (
              <article key={alert.id} className="rounded-2xl border border-white/70 bg-white/85 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-accent">{alert.destinationName}</p>
                    <h3 className="mt-1 text-base font-semibold text-navy">{alert.typeLabel}</h3>
                    <p className="mt-1 text-sm text-navy-muted">{alert.message}</p>
                    <p className="mt-2 text-xs text-navy-muted">{formatUpdateDate(alert.date)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClassMap[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
                <Link to={alert.ctaTo} className="mt-3 inline-flex text-xs font-semibold text-navy hover:text-sky-accent">
                  {alert.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Recent stay plans</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Latest long-stay feasibility snapshots</h2>
            <p className="mt-2 text-sm text-navy-muted">
              Saved 30–90 day feasibility assessments for your planning workspace.
            </p>
          </div>
          <Link to="/stay-planner" className="btn-secondary inline-flex items-center justify-center px-5 py-2.5 text-sm">
            Open Stay Planner
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-2xl border border-sky-accent/20 bg-sky-50/70 px-4 py-3 text-sm text-navy-muted">
            Sign in to save and view stay plans across devices.
          </div>
        ) : recentStayPlans.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy-muted">
            No saved stay plans yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {recentStayPlans.map((plan) => (
              <article key={plan.id} className="rounded-2xl border border-white/70 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">{plan.country}</p>
                <h3 className="mt-2 text-lg font-semibold text-navy">{plan.destination_name}</h3>
                <p className="mt-2 text-sm text-navy-muted">{plan.stay_length_days} day stay</p>
                <p className="mt-1 text-sm text-navy-muted">Score: {plan.feasibility_score}/100</p>
                <p className="mt-1 text-xs capitalize text-navy-muted">{plan.recommendation.replace(/-/g, ' ')}</p>
                <p className="mt-3 text-xs text-navy-muted">Saved {formatPlanDate(plan.created_at)}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Stay Planner CTA */}
      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">30–90 Day Stay Planner</div>
            <h2 className="mt-3 text-2xl font-semibold text-navy">Assess long-stay feasibility</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-navy-muted">
              Planning a 30, 60, or 90-day stay? Get a cost estimate, visa snapshot, internet fit, housing pressure, and a full preparation checklist — tailored to your budget and work style.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-navy-muted">
              {['Cost estimate', 'Visa snapshot', 'Internet & remote work fit', 'Safety signals', 'Stay checklist'].map((label) => (
                <span key={label} className="rounded-full border border-white/60 bg-white/80 px-2.5 py-1 font-medium text-navy shadow-soft">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <Link to="/stay-planner" className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm">
            Open Stay Planner
          </Link>
        </div>
      </section>

      {/* Compare CTA */}
      <section className="glass-card rounded-[1.75rem] border border-sand/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">Destination Compare</div>
            <h2 className="mt-3 text-2xl font-semibold text-navy">Compare destinations side by side</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-navy-muted">
              Compare readiness, cost, risk, and long-stay fit before choosing where to go. Select 2–3 destinations, pick a travel mode, and get a weighted decision summary.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-navy-muted">
              {['Readiness score', 'Cost comparison', 'Visa friction', 'Safety signals', 'Trust & freshness'].map((label) => (
                <span key={label} className="rounded-full border border-white/60 bg-white/80 px-2.5 py-1 font-medium text-navy shadow-soft">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <Link to="/compare" className="btn-secondary inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm">
            Compare destinations
          </Link>
        </div>
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