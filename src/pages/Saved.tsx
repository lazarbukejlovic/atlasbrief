import { useAtlasBrief } from '../components/AppLayout';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserPlanBadge from '../components/UserPlanBadge';
import ReadinessStatusBadge from '../components/ReadinessStatusBadge';
import FreshnessBadge from '../components/FreshnessBadge';
import { getDestinationById } from '../data/destinations';
import { getDestinationTrustMetadata, getFreshnessReviewHint } from '../data/destinationTrust';
import {
  getRelativeUpdateLabel,
  getWatchlistSignal,
  type WatchSeverity,
} from '../data/watchlistSignals';

const severityBadgeClass: Record<WatchSeverity, string> = {
  Low: 'bg-sky-soft text-navy',
  Watch: 'bg-amber-100 text-amber-900',
  Elevated: 'bg-sand/25 text-navy',
};

const Saved = () => {
  const { savedBriefs, savedIds, savedLimit, loadingSavedBriefs } = useAtlasBrief();
  const { isAuthenticated, currentPlan } = useAuth();

  return (
    <div className="space-y-8">
      <section>
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Saved Briefs</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Saved Trip Readiness Briefs</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
          Reopen saved trip readiness briefs quickly while keeping your monitored destination signals separate in the watchlist.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <UserPlanBadge plan={currentPlan} />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft">
            Usage: {savedIds.length}/{savedLimit === 'Custom' ? 'Custom' : savedLimit}
          </span>
          <Link to="/watchlist" className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-accent shadow-soft">
            Open Destination Watchlist
          </Link>
        </div>
        {!isAuthenticated ? (
          <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-white/75 px-4 py-3 text-sm text-navy-muted">
            Create an account to keep your readiness watchlist across devices.{' '}
            <Link to="/signup" className="font-semibold text-sky-accent">
              Create your readiness workspace
            </Link>
          </div>
        ) : null}
      </section>

      {loadingSavedBriefs ? (
        <section className="glass-card rounded-[1.75rem] p-6 text-sm text-navy-muted">
          Loading saved briefs...
        </section>
      ) : savedBriefs.length === 0 ? (
        <section className="space-y-6">
          <EmptyState
            title="Your destination watchlist is empty"
            description="Watchlist intelligence appears here once you save a destination. Track safety movement, cost signals, currency shifts, and local rule updates in one place."
            actionLabel="Browse destinations"
            actionHref="/destinations"
          />
          <article className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Watchlist Intelligence</p>
            <h2 className="mt-3 text-2xl font-semibold text-navy">No tracked destinations yet</h2>
            <p className="mt-3 text-sm leading-7 text-navy-muted">
              Save a city to start monitoring currency direction, safety alerts, and local rules in one concise intelligence card.
            </p>
          </article>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {savedBriefs.map((brief) => (
            <article key={`${brief.destination_id}-${brief.id ?? 'local'}`} className="card-base rounded-[1.5rem] p-5">
              {(() => {
                const signal = getWatchlistSignal(brief.destination_id);
                const destination = getDestinationById(brief.destination_id);
                const trustMetadata = getDestinationTrustMetadata(brief.destination_id);
                const reviewHint = trustMetadata
                  ? getFreshnessReviewHint(trustMetadata.freshnessStatus)
                  : null;
                const relativeUpdated = signal
                  ? getRelativeUpdateLabel(signal.updatedAt)
                  : getRelativeUpdateLabel(brief.last_checked);

                return (
                  <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-accent">Saved brief intelligence</p>
                  <h3 className="mt-2 text-xl font-semibold text-navy">
                    {brief.city}, {brief.country}
                  </h3>
                  <p className="mt-2 text-xs font-medium text-navy-muted">{relativeUpdated}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <ReadinessStatusBadge
                    status={brief.readiness_status as 'Ready' | 'Review' | 'Watch Closely'}
                    size="sm"
                  />
                  {trustMetadata ? (
                    <FreshnessBadge freshnessStatus={trustMetadata.freshnessStatus} compact />
                  ) : null}
                  {signal ? (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityBadgeClass[signal.severity]}`}>
                      {signal.severity}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Readiness score</p>
                  <p className="mt-1 text-lg font-semibold text-navy">{brief.readiness_score}%</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Safety score</p>
                  <p className="mt-1 text-lg font-semibold text-navy">{brief.safety_score}%</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Cost band</p>
                  <p className="mt-1 text-base font-semibold text-navy">{brief.cost_band}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Alert status</p>
                  <p className="mt-1 text-base font-semibold text-navy">
                    {signal ? `${signal.activeSignals} watch signals active` : 'Baseline monitoring'}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-sky-accent/20 bg-sky-50/70 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">Currency signal</p>
                  <p className="mt-1 text-sm text-navy-muted">
                    {signal?.currencySignal ?? destination?.exchangeNote ?? 'No currency shift currently flagged.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-sand/30 bg-ivory p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-sand">Cost trend</p>
                  <p className="mt-1 text-sm text-navy-muted">
                    {signal?.costTrend ?? 'Cost movement is stable in this cycle.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-accent/20 bg-white/90 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">Safety signal</p>
                  <p className="mt-1 text-sm text-navy-muted">
                    {signal?.safetySignal ?? destination?.advisoryNote ?? 'No safety escalation reported.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/85 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Local rules / visa note</p>
                  <p className="mt-1 text-sm text-navy-muted">
                    {signal?.localRulesVisaNote ?? destination?.visaSnapshot ?? 'Review local entry guidance before departure.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-sky-50/70 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">What changed</p>
                <p className="mt-1 text-sm text-navy-muted">{brief.what_changed}</p>
              </div>

              {trustMetadata ? (
                <div className="mt-3 rounded-2xl border border-white/70 bg-white/85 p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Freshness checks</p>
                  <p className="mt-1 text-sm text-navy-muted">
                    Last checked: {new Date(trustMetadata.lastCheckedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="mt-1 text-sm text-navy-muted">
                    Next review due: {new Date(trustMetadata.nextReviewDue).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ) : null}

              {reviewHint ? (
                <div className="mt-3 rounded-2xl border border-amber-300/80 bg-amber-50/90 p-3 text-sm text-amber-950">
                  <span className="font-semibold">Review before booking.</span> This saved brief is marked {trustMetadata?.freshnessStatus === 'review-soon' ? 'review-soon' : 'stale'} and may need an updated check.
                </div>
              ) : null}

              <Link
                to={`/destinations/${brief.destination_id}`}
                className="mt-4 inline-flex rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light"
              >
                Open full destination brief
              </Link>
                  </>
                );
              })()}
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Saved;