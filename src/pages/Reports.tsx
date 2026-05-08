import { Copy, Download, Printer, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FreshnessBadge from '../components/FreshnessBadge';
import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { destinations, getDestinationReadinessScore } from '../data/destinations';
import { tripPurposeLabels, useTravelerProfile } from '../hooks/useTravelerProfile';
import {
  getRecentReportEvents,
  trackRecentReportEvent,
  type RecentReportEvent,
  type ReportType,
} from '../utils/reportEvents';

const reportTypeLabels: Record<ReportType, string> = {
  'trip-readiness': 'Trip readiness summary',
  'long-stay-feasibility': 'Long-stay feasibility summary',
  'family-group-readiness': 'Family/group readiness summary',
};

const reportTypeDescriptions: Record<ReportType, string> = {
  'trip-readiness': 'Best for booking decisions and final pre-trip checks.',
  'long-stay-feasibility': 'Focused on longer planning windows and operational fit.',
  'family-group-readiness': 'Designed for family or small-group readiness alignment.',
};

const orderedTypes: ReportType[] = ['trip-readiness', 'long-stay-feasibility', 'family-group-readiness'];

const getTypeFromParam = (value: string | null): ReportType => {
  if (value === 'long-stay-feasibility' || value === 'family-group-readiness') {
    return value;
  }

  return 'trip-readiness';
};

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown';
  }

  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatShortDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown';
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const actionLabelMap: Record<RecentReportEvent['action'], string> = {
  'copy-summary': 'Copied summary',
  'print-preview': 'Printed preview',
};

const Reports = () => {
  const { profile } = useTravelerProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const destinationParam = searchParams.get('destination');
  const typeParam = searchParams.get('type');

  const initialType = getTypeFromParam(typeParam);
  const initialDestination = destinations.find((item) => item.id === destinationParam) ?? destinations[0];

  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [destinationId, setDestinationId] = useState<string>(initialDestination.id);
  const [copyMessage, setCopyMessage] = useState<string>('');
  const [recentEvents, setRecentEvents] = useState<RecentReportEvent[]>(() => getRecentReportEvents());

  const destination = useMemo(
    () => destinations.find((item) => item.id === destinationId) ?? destinations[0],
    [destinationId]
  );

  const trustMetadata = getDestinationTrustMetadata(destination.id);
  const readinessScore = getDestinationReadinessScore(destination);
  const checklistPrepared = Math.max(1, Math.min(destination.checklist.length, Math.ceil(destination.checklist.length * 0.6)));

  const cautionLabel =
    destination.readinessStatus === 'Ready'
      ? 'Maintain baseline checks'
      : destination.readinessStatus === 'Review'
        ? 'Review recent entry and safety shifts'
        : 'Watch closely for updates';

  const checklistPercent = Math.round((checklistPrepared / destination.checklist.length) * 100);
  const personalizationLine =
    profile.riskTolerance === 'cautious'
      ? 'Cautious profile: emphasize official checks and recent change review before booking decisions.'
      : profile.tripPurpose === 'business'
        ? 'Business profile: emphasize reliability, transit continuity, and operational readiness.'
        : profile.tripPurpose === 'remote-work'
          ? 'Remote-work profile: emphasize internet quality, monthly cost fit, stay length, and workspace rhythm.'
          : profile.tripPurpose === 'family-group-travel'
            ? 'Family/group profile: emphasize shared readiness, document prep, and checklist alignment.'
            : 'Balanced readiness context based on your planning preferences.';

  const personalizedSteps =
    profile.riskTolerance === 'cautious'
      ? [
          'Review official sources before booking any non-refundable travel.',
          'Re-check alerts and recent changes one more time before payment.',
          'Confirm entry and health-related requirements from official channels.',
        ]
      : profile.tripPurpose === 'business'
        ? [
            'Prioritize transit reliability and route continuity for meeting windows.',
            'Review operational signals and freshness before booking.',
            'Validate official entry requirements for your work itinerary.',
          ]
        : profile.tripPurpose === 'remote-work'
          ? [
              'Confirm internet and workspace fit with your expected cadence.',
              'Review monthly cost assumptions for the intended stay length.',
              'Re-check official requirements before committing to lodging.',
            ]
          : profile.tripPurpose === 'family-group-travel'
            ? [
                'Align shared checklist items and readiness expectations for all travelers.',
                'Review document and entry requirements for the group context.',
                'Confirm safety and rules updates before booking decisions.',
              ]
            : [
                'Review official sources before booking.',
                'Recheck alerts and what changed before paying deposits.',
                'Compare external travel options after confirming readiness.',
              ];

  const reportSummaryText = [
    `AtlasBrief Readiness summary (${reportTypeLabels[reportType]})`,
    `${destination.city}, ${destination.country}`,
    `Readiness score: ${readinessScore}/100`,
    `Best for: ${destination.bestFor.slice(0, 2).join(', ')}`,
    `Caution: ${cautionLabel}`,
    `Budget band: ${destination.budgetBand}`,
    `Safety signal: ${destination.advisoryNote}`,
    `What changed: ${destination.whatChanged[0] ?? 'No major shift noted in this cycle.'}`,
    `Checklist progress: ${checklistPrepared}/${destination.checklist.length}`,
    `Last checked: ${formatShortDate(destination.lastCheckedAt ?? destination.lastChecked)}`,
    `Source confidence: ${Math.round(destination.sourceConfidence * 100)}%`,
    `Traveler profile context: ${tripPurposeLabels[profile.tripPurpose]} · ${profile.riskTolerance}`,
    'Review official sources before booking.',
    'Preview export only. Not official travel documentation.',
  ].join('\n');

  const syncQueryParams = (nextDestinationId: string, nextType: ReportType) => {
    setSearchParams({
      destination: nextDestinationId,
      type: nextType,
    });
  };

  const refreshRecentEvents = () => {
    setRecentEvents(getRecentReportEvents());
  };

  const handleTypeSelect = (next: ReportType) => {
    setReportType(next);
    syncQueryParams(destinationId, next);
  };

  const handleDestinationChange = (nextDestinationId: string) => {
    setDestinationId(nextDestinationId);
    syncQueryParams(nextDestinationId, reportType);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(reportSummaryText);
      setCopyMessage('Readiness summary copied to clipboard.');
    } catch {
      setCopyMessage('Clipboard unavailable. You can still use Print preview.');
    }

    trackRecentReportEvent({
      reportType,
      destination: `${destination.city}, ${destination.country}`,
      action: 'copy-summary',
    });
    refreshRecentEvents();
  };

  const handlePrintPreview = () => {
    trackRecentReportEvent({
      reportType,
      destination: `${destination.city}, ${destination.country}`,
      action: 'print-preview',
    });
    refreshRecentEvents();

    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-sky-accent/20 p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Readiness reports</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Readiness reports for decisions, bookings, and travel prep.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          Turn destination intelligence into a clear trip-readiness summary before you commit.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="mb-4 rounded-2xl border border-sky-accent/15 bg-sky-50/60 p-4 text-sm text-navy-muted">
          <span className="font-semibold text-navy">Personalized by your traveler profile:</span> {personalizationLine}
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Report type selector</div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {orderedTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeSelect(type)}
              className={`rounded-2xl border p-4 text-left transition ${
                reportType === type
                  ? 'border-sky-accent/40 bg-sky-50/80 shadow-soft'
                  : 'border-white/70 bg-white/80 hover:border-sky-accent/30'
              }`}
            >
              <p className="text-sm font-semibold text-navy">{reportTypeLabels[type]}</p>
              <p className="mt-1 text-xs leading-6 text-navy-muted">{reportTypeDescriptions[type]}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Destination</span>
            <select
              value={destinationId}
              onChange={(event) => handleDestinationChange(event.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm font-medium text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            >
              {destinations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.city}, {item.country}
                </option>
              ))}
            </select>
          </label>

          <Link
            to={`/destinations/${destination.id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white px-5 py-3 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80"
          >
            Open destination brief
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-navy/10 bg-white p-8 shadow-card print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-accent/20 pb-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Destination readiness report preview</div>
            <h2 className="mt-2 text-3xl font-semibold text-navy">{reportTypeLabels[reportType]}</h2>
            <p className="mt-2 text-sm text-navy-muted">Readiness summary · Preview export</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-ivory px-4 py-3 text-right">
            <div className="text-xs uppercase tracking-[0.16em] text-navy-muted">Readiness score</div>
            <div className="mt-1 text-3xl font-semibold text-navy">{readinessScore}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-white/70 bg-ivory/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Destination</p>
            <p className="mt-2 text-lg font-semibold text-navy">{destination.city}</p>
            <p className="text-sm text-navy-muted">{destination.country}</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-ivory/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Best for</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {destination.bestFor.slice(0, 3).map((item) => (
                <span key={item} className="rounded-full bg-sky-soft px-2.5 py-1 text-xs font-semibold text-navy">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Caution label</p>
            <p className="mt-1 text-sm text-navy">{cautionLabel}</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-ivory/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Entry / rules summary</p>
            <p className="mt-2 text-sm leading-7 text-navy-muted">{destination.requirementSummary}</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-ivory/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Budget band</p>
            <p className="mt-2 text-base font-semibold text-navy">{destination.budgetBand}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-navy-muted">Safety / advisory signal</p>
            <p className="mt-1 text-sm leading-7 text-navy-muted">{destination.advisoryNote}</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-ivory/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">What changed since last check</p>
            <ul className="mt-2 space-y-2 text-sm text-navy-muted">
              {destination.whatChanged.slice(0, 2).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-white/70 bg-ivory/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Checklist progress</p>
            <p className="mt-2 text-base font-semibold text-navy">
              {checklistPrepared}/{destination.checklist.length} prepared ({checklistPercent}%)
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-sky-accent" style={{ width: `${checklistPercent}%` }} />
            </div>
          </article>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-sky-accent/20 bg-sky-50/60 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">Trust and freshness</p>
            <p className="mt-2 text-sm text-navy-muted">
              Last checked:{' '}
              {formatShortDate(trustMetadata?.lastCheckedAt ?? destination.lastCheckedAt ?? destination.lastChecked)}
            </p>
            <p className="mt-1 text-sm text-navy-muted">Source confidence: {Math.round(destination.sourceConfidence * 100)}%</p>
            {trustMetadata ? (
              <div className="mt-3">
                <FreshnessBadge freshnessStatus={trustMetadata.freshnessStatus} />
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl border border-sand/40 bg-ivory p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-sand">Suggested next steps</p>
            <ul className="mt-2 space-y-2 text-sm text-navy-muted">
              {personalizedSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-navy-muted">Partner redirect reminder: external booking tools should be used only after readiness review.</p>
          </article>
        </div>

        <div className="mt-5 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-xs leading-6 text-navy-muted">
          <span className="font-semibold text-navy">Disclaimer:</span> This readiness summary is a planning preview and not official travel documentation. Conditions can change. Review official sources before booking.
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6 print:hidden">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Export/share preview actions</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => void handleCopySummary()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-light"
          >
            <Copy className="h-4 w-4" />
            Copy report summary
          </button>

          <button
            type="button"
            onClick={handlePrintPreview}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white px-4 py-3 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80"
          >
            <Printer className="h-4 w-4" />
            Print preview
          </button>

          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-sand/40 bg-ivory px-4 py-3 text-sm font-semibold text-navy-muted"
            title="Pro preview"
          >
            <Download className="h-4 w-4" />
            Export PDF preview - Pro
          </button>

          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-sand/40 bg-ivory px-4 py-3 text-sm font-semibold text-navy-muted"
            title="Coming soon"
          >
            <Share2 className="h-4 w-4" />
            Share link preview - Pro
          </button>
        </div>
        {copyMessage ? <p className="mt-3 text-sm text-navy-muted">{copyMessage}</p> : null}
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Recent report mock list</div>
        {recentEvents.length === 0 ? (
          <div className="mt-4 space-y-3">
            <article className="rounded-2xl border border-white/70 bg-white/85 p-4 text-sm text-navy-muted">
              Trip readiness summary · Lisbon, Portugal · Preview mock
            </article>
            <article className="rounded-2xl border border-white/70 bg-white/85 p-4 text-sm text-navy-muted">
              Long-stay feasibility summary · Tokyo, Japan · Preview mock
            </article>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {recentEvents.slice(0, 8).map((event, index) => (
              <article key={`${event.timestamp}-${index}`} className="rounded-2xl border border-white/70 bg-white/85 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy">{reportTypeLabels[event.reportType]}</p>
                    <p className="mt-1 text-sm text-navy-muted">{event.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-accent">{actionLabelMap[event.action]}</p>
                    <p className="mt-1 text-xs text-navy-muted">{formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-sky-accent/15 bg-sky-50/60 p-4">
        <p className="text-sm leading-7 text-navy-muted">
          <span className="font-semibold text-navy">Trust and freshness disclosure:</span> Readiness summary previews are designed for planning. Last checked and source confidence signals improve decision context, but you should review official sources before booking.
        </p>
      </section>
    </div>
  );
};

export default Reports;