import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import FreshnessBadge from '../components/FreshnessBadge';
import TripNextStepPanel from '../components/TripNextStepPanel';
import WhatChangedCard from '../components/WhatChangedCard';
import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { getDestinationUpdates } from '../data/travelIntelligenceUpdates';
import { useAtlasBrief } from '../components/AppLayout';

const severityClasses: Record<string, string> = {
  low: 'bg-sky-soft text-navy',
  watch: 'bg-amber-100 text-amber-900',
  elevated: 'bg-sand/25 text-navy',
};

const Watchlist = () => {
  const {
    watchlist,
    watchlistIds,
    loadingWatchlist,
    watchlistError,
    watchlistLimit,
    watchlistLimitMessage,
    removeFromWatchlist,
  } = useAtlasBrief();

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Destination Watchlist</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Destination Watchlist</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          Monitor destination signals before you book. Track readiness movement, currency direction, cost pressure, local rules, and safety context in one place.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-navy-muted">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-navy shadow-soft">
            Watched destinations: {watchlistIds.length}/{watchlistLimit}
          </span>
          <Link to="/alerts" className="rounded-full bg-white px-3 py-1 font-semibold text-sky-accent shadow-soft">
            View related alerts
          </Link>
          <span className="rounded-full bg-white/80 px-3 py-1">
            Signals are informational and should be checked before booking.
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1">
            Live data integrations planned.
          </span>
        </div>
      </section>

      {watchlistLimitMessage ? (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          {watchlistLimitMessage}
        </div>
      ) : null}

      {watchlistError ? (
        <section className="rounded-[1.75rem] border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-950">
          {watchlistError}
        </section>
      ) : null}

      <TripNextStepPanel
        title="External tools for watchlist follow-through"
        description="Use flight and stay tools externally to monitor availability after reviewing watch signals."
        categories={['flights', 'stays', 'local-transport']}
      />

      {loadingWatchlist ? (
        <section className="glass-card rounded-[1.75rem] p-6 text-sm text-navy-muted">
          Loading destination watchlist...
        </section>
      ) : watchlist.length === 0 ? (
        <EmptyState
          title="No watched destinations yet"
          description="Add a destination to your watchlist to start monitoring travel intelligence before you book."
          actionLabel="Explore destinations"
          actionHref="/destinations"
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {watchlist.map((item) => {
            const trustMetadata = getDestinationTrustMetadata(item.destination_id);
            const changes = getDestinationUpdates(item.destination_id, 3);

            return (
            <article key={item.id ?? item.destination_id} className="glass-card rounded-[1.75rem] p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Tracked destination</div>
                  <h2 className="mt-2 text-2xl font-semibold text-navy">{item.destination_name}</h2>
                  <p className="mt-1 text-sm text-navy-muted">{item.country}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityClasses[item.severity] ?? severityClasses.low}`}>
                    {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                  </span>
                  <span className="text-xs text-navy-muted">{item.last_updated_label}</span>
                  {trustMetadata ? (
                    <FreshnessBadge freshnessStatus={trustMetadata.freshnessStatus} compact />
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Readiness score</p>
                  <p className="mt-2 text-2xl font-semibold text-navy">{item.readiness_score}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Signal layer</p>
                  <p className="mt-2 text-base font-semibold text-navy">{item.severity === 'elevated' ? 'Elevated attention' : item.severity === 'watch' ? 'Watch conditions' : 'Stable monitor'}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-sky-accent/20 bg-sky-50/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">Currency signal</p>
                  <p className="mt-2 text-sm text-navy-muted">{item.currency_signal}</p>
                </div>
                <div className="rounded-2xl border border-sand/30 bg-ivory p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-sand">Cost trend</p>
                  <p className="mt-2 text-sm text-navy-muted">{item.cost_trend}</p>
                </div>
                <div className="rounded-2xl border border-sky-accent/20 bg-white/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">Safety signal</p>
                  <p className="mt-2 text-sm text-navy-muted">{item.safety_signal}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/85 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Local rules / visa note</p>
                  <p className="mt-2 text-sm text-navy-muted">{item.local_rules_note}</p>
                </div>
                {trustMetadata ? (
                  <div className="rounded-2xl border border-white/70 bg-white/85 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Next review due</p>
                    <p className="mt-2 text-sm text-navy-muted">
                      {new Date(trustMetadata.nextReviewDue).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <WhatChangedCard
                  updates={changes}
                  emptyMessage="No recent static update preview for this destination."
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Link to={`/destinations/${item.destination_id}`} className="text-sm font-semibold text-navy hover:text-sky-accent">
                    Open destination brief
                  </Link>
                  <Link to={`/alerts?destination=${item.destination_id}`} className="text-sm font-semibold text-sky-accent hover:text-navy">
                    View related alerts
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => void removeFromWatchlist(item.destination_id)}
                  className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80"
                >
                  Remove
                </button>
              </div>
            </article>
          )})}
        </section>
      )}
    </div>
  );
};

export default Watchlist;
