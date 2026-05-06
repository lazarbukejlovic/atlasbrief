import { useAtlasBrief } from '../components/AppLayout';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserPlanBadge from '../components/UserPlanBadge';
import ReadinessStatusBadge from '../components/ReadinessStatusBadge';

const Saved = () => {
  const { savedBriefs, savedIds, savedLimit, loadingSavedBriefs } = useAtlasBrief();
  const { isAuthenticated, currentPlan } = useAuth();

  return (
    <div className="space-y-8">
      <section>
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Watchlist</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Destination Watchlist</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
          Monitor your saved readiness briefs. Track changes in rules, costs, safety, and readiness status.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <UserPlanBadge plan={currentPlan} />
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft">
            Usage: {savedIds.length}/{savedLimit === 'Custom' ? 'Custom' : savedLimit}
          </span>
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
        <EmptyState
          title="No saved destinations yet"
          description="Your watchlist is empty. Save a destination to monitor readiness, cost, safety, and rule changes before you book."
          actionLabel="Browse destinations"
          actionHref="/destinations"
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {savedBriefs.map((brief) => (
            <article key={`${brief.destination_id}-${brief.id ?? 'local'}`} className="card-base rounded-[1.5rem] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-accent">Saved brief</p>
                  <h3 className="mt-2 text-xl font-semibold text-navy">
                    {brief.city}, {brief.country}
                  </h3>
                </div>
                <ReadinessStatusBadge
                  status={brief.readiness_status as 'Ready' | 'Review' | 'Watch Closely'}
                  size="sm"
                />
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
                  <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Last checked</p>
                  <p className="mt-1 text-base font-semibold text-navy">{brief.last_checked}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-sky-50/70 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">What changed</p>
                <p className="mt-1 text-sm text-navy-muted">{brief.what_changed}</p>
              </div>

              <Link
                to={`/destinations/${brief.destination_id}`}
                className="mt-4 inline-flex rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light"
              >
                Open full destination brief
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Saved;