import { AlertTriangle, Archive, BellRing, BookOpenCheck, CheckCheck, ChevronRight, Filter, Globe2, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getDestinationById } from '../data/destinations';
import { notificationPreferenceLabels, riskToleranceLabels, useTravelerProfile } from '../hooks/useTravelerProfile';
import type { AlertFilter } from '../lib/alerts';
import { useAlerts } from '../hooks/useAlerts';

const filterOptions: { value: AlertFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'important', label: 'Important' },
  { value: 'watch', label: 'Watch' },
  { value: 'requirements', label: 'Requirements' },
  { value: 'cost', label: 'Cost' },
  { value: 'safety', label: 'Safety' },
  { value: 'currency', label: 'Currency' },
  { value: 'freshness', label: 'Freshness' },
];

const severityClassMap = {
  info: 'bg-sky-soft text-navy',
  watch: 'bg-amber-100 text-amber-900',
  important: 'bg-rose-100 text-rose-900',
};

const summaryCards = [
  { key: 'unreadCount', label: 'Unread alerts', icon: <BellRing className="h-5 w-5" /> },
  { key: 'watchCount', label: 'Watch-level alerts', icon: <ShieldAlert className="h-5 w-5" /> },
  { key: 'importantCount', label: 'Important alerts', icon: <AlertTriangle className="h-5 w-5" /> },
  { key: 'destinationsMonitoredCount', label: 'Destinations monitored', icon: <Globe2 className="h-5 w-5" /> },
] as const;

const formatAlertDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Updated recently';
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Alerts = () => {
  const { profile } = useTravelerProfile();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<AlertFilter>('all');
  const destinationId = searchParams.get('destination') ?? undefined;
  const focusDestination = destinationId ? getDestinationById(destinationId) : null;

  const {
    alerts,
    unreadCount,
    watchCount,
    importantCount,
    destinationsMonitoredCount,
    filterAlerts,
    markAsRead,
    markAllAsRead,
    archiveAlert,
  } = useAlerts({ destinationId });

  const filteredAlerts = useMemo(() => filterAlerts(activeFilter), [activeFilter, filterAlerts]);
  const hasAnyAlerts = alerts.length > 0;
  const alertSensitivityNote =
    profile.riskTolerance === 'cautious'
      ? 'Cautious profile: prioritize important and watch alerts, then re-check official requirements before booking.'
      : profile.riskTolerance === 'flexible'
        ? 'Flexible profile: keep alert awareness broad and review major changes at milestone decisions.'
        : 'Balanced profile: monitor major changes and destination-level watch signals during planning.';

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Travel Monitoring</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Travel intelligence alerts</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          Track what changed across your saved and watched destinations before you book.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-navy-muted">
          Alerts are planning signals, not legal, immigration, safety, or booking advice.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-navy-muted">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-navy shadow-soft">
            Active alerts: {alerts.length}
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1">Unread: {unreadCount}</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Destinations monitored: {destinationsMonitoredCount}</span>
          {focusDestination ? (
            <span className="rounded-full bg-sky-soft px-3 py-1 font-medium text-navy">
              Focused on {focusDestination.city}
            </span>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const value =
            card.key === 'unreadCount'
              ? unreadCount
              : card.key === 'watchCount'
                ? watchCount
                : card.key === 'importantCount'
                  ? importantCount
                  : destinationsMonitoredCount;

          return (
            <article key={card.key} className="glass-card rounded-[1.75rem] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Summary</p>
                  <h2 className="mt-2 text-base font-semibold text-navy">{card.label}</h2>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-navy">{value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-accent shadow-soft">
                  {card.icon}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Alert Filters</div>
            <h2 className="mt-2 text-2xl font-semibold text-navy">Filter what needs attention</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={alerts.length === 0 || unreadCount === 0}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-soft transition ${
                alerts.length === 0 || unreadCount === 0
                  ? 'cursor-not-allowed border-white/60 bg-white/60 text-navy-muted/60'
                  : 'border-white/70 bg-white text-navy hover:bg-white/80'
              }`}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
            {focusDestination ? (
              <Link to="/alerts" className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
                <Filter className="h-4 w-4" />
                Clear destination focus
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === option.value
                  ? 'bg-navy text-white shadow-soft'
                  : 'border border-white/70 bg-white/80 text-navy-muted hover:border-sky-accent/30 hover:bg-white hover:text-navy'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Alert Feed</div>
            <h2 className="mt-2 text-2xl font-semibold text-navy">What changed across your monitored destinations</h2>
          </div>
          <span className="text-sm text-navy-muted">
            {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'} shown
          </span>
        </div>

        {!hasAnyAlerts ? (
          <div className="glass-card rounded-[1.75rem] p-6 text-sm text-navy-muted">
            <p className="font-semibold text-navy">No active alerts right now.</p>
            <p className="mt-2">Save briefs, build a watchlist, or save a stay plan to start monitoring destination changes here.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/destinations" className="btn-secondary px-5 py-2.5 text-sm">
                Explore destinations
              </Link>
              <Link to="/watchlist" className="btn-primary px-5 py-2.5 text-sm">
                Open watchlist
              </Link>
            </div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="glass-card rounded-[1.75rem] p-6 text-sm text-navy-muted">
            <p className="font-semibold text-navy">No alerts match this filter.</p>
            <p className="mt-2">Try another filter or clear the destination focus to see the broader alert feed.</p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="btn-secondary mt-4 px-4 py-2 text-sm"
            >
              Show all alerts
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <article
                key={alert.id}
                className={`rounded-[1.5rem] border p-5 shadow-soft transition ${
                  alert.isRead
                    ? 'border-white/60 bg-white/60 opacity-85'
                    : 'border-white/70 bg-white/90'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">{alert.country}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${severityClassMap[alert.severity]}`}>
                        {alert.severity}
                      </span>
                      {alert.isRead ? (
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-navy-muted">
                          Read
                        </span>
                      ) : (
                        <span className="rounded-full bg-sand/20 px-2.5 py-1 text-[11px] font-semibold text-navy">
                          Unread
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-navy">{alert.destinationName}</h3>
                      <span className="text-sm text-navy-muted">· {alert.typeLabel}</span>
                    </div>

                    <p className="mt-2 text-sm leading-7 text-navy-muted">{alert.message}</p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-navy-muted">
                      <span>{formatAlertDate(alert.date)}</span>
                      <span>{alert.sourceNote}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    <Link
                      to={alert.ctaTo}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80"
                    >
                      {alert.ctaLabel}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    {!alert.isRead ? (
                      <button
                        type="button"
                        onClick={() => markAsRead(alert.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-navy-muted shadow-soft transition hover:text-navy"
                      >
                        <BookOpenCheck className="h-4 w-4" />
                        Mark as read
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => archiveAlert(alert.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-navy-muted shadow-soft transition hover:text-navy"
                    >
                      <Archive className="h-4 w-4" />
                      Dismiss
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-sky-accent/10 bg-sky-soft/50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" />
          <p className="text-sm leading-relaxed text-navy-muted">
            <span className="font-semibold text-navy">Planning signals only.</span>{' '}
            Use alerts to prioritize what to re-check. They are not legal, immigration, safety, or booking advice.
          </p>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4">
        <p className="text-sm text-navy-muted">
          <span className="font-semibold text-navy">Alert sensitivity:</span> {notificationPreferenceLabels[profile.notificationPreference]} · {riskToleranceLabels[profile.riskTolerance]}. {alertSensitivityNote}
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-sand/40 bg-white/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-navy-muted">
            <span className="font-semibold text-navy">Advanced monitoring - Pro preview.</span> Expanded monitoring workflows are planned in Pro while current alerts remain fully available.
          </p>
          <Link to="/pro" className="text-sm font-semibold text-navy hover:text-sky-accent">
            View Pro preview
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Alerts;