import { AlertTriangle, ArrowLeft, Bookmark, BellRing } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';
import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { getDestinationUpdates } from '../data/travelIntelligenceUpdates';
import { useAuth } from '../hooks/useAuth';
import { getDossierLastChecked, getDossierSnapshotBySlug } from '../lib/dossiers';
import { useAtlasBrief } from '../components/AppLayout';

const DossierDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { toggleSaved, isSaved, toggleWatchlist, isWatched } = useAtlasBrief();

  if (!slug) {
    return <Navigate to="/dossiers" replace />;
  }

  const dossier = getDossierSnapshotBySlug(slug);
  if (!dossier) {
    return <Navigate to="/dossiers" replace />;
  }

  const destination = dossier.destination;
  const trust = getDestinationTrustMetadata(destination.id);
  const updates = getDestinationUpdates(destination.id, 3);
  const saved = isSaved(destination.id);
  const watched = isWatched(destination.id);
  const lastChecked = getDossierLastChecked(destination.id, destination.lastChecked);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${destination.city} travel-readiness dossier`,
    description: `AtlasBrief planning intelligence dossier for ${destination.city}, ${destination.country}.`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'AtlasBrief',
      url: 'https://atlasbrief.vercel.app',
    },
    about: {
      '@type': 'Place',
      name: `${destination.city}, ${destination.country}`,
    },
  };

  return (
    <div className="space-y-8">
      <SeoMeta
        title={`${destination.city} Dossier | AtlasBrief`}
        description={`Travel-readiness dossier for ${destination.city}. Review entry friction, budget signals, risk context, and trust/freshness before booking.`}
        canonicalPath={`/dossiers/${destination.id}`}
        jsonLd={jsonLd}
      />

      <section className="pt-1">
        <Link to="/dossiers" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" />
          Back to all dossiers
        </Link>
      </section>

      <section className="glass-card rounded-[2rem] border border-sky-accent/20 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Public destination dossier</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
              {destination.city}, {destination.country}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">{dossier.positioningLine}</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Readiness score</p>
            <p className="mt-1 text-3xl font-semibold text-navy">{dossier.readinessScore}</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Trip readiness snapshot</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Entry friction</p>
            <p className="mt-1 text-sm text-navy">{dossier.entryFriction}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Budget level</p>
            <p className="mt-1 text-sm text-navy">{dossier.budgetLevel}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Safety / risk signal</p>
            <p className="mt-1 text-sm text-navy">{dossier.safetySignal}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Remote-work fit</p>
            <p className="mt-1 text-sm text-navy">{dossier.remoteWorkFit}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4 md:col-span-2 xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Long-stay feasibility</p>
            <p className="mt-1 text-sm text-navy">{dossier.longStayFeasibility}</p>
          </article>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">What changed recently</div>
        <div className="mt-4 space-y-3">
          {updates.length === 0 ? (
            <p className="rounded-2xl bg-white/85 p-4 text-sm text-navy-muted">No recent change events in this demo cycle.</p>
          ) : (
            updates.map((update) => (
              <article key={update.id} className="rounded-2xl bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-accent">{update.changeType}</p>
                <p className="mt-1 text-sm text-navy-muted">{update.message}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sand/35 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Before you book</div>
        <ul className="mt-4 space-y-2 text-sm text-navy-muted">
          <li>Passport and entry reminder: {destination.passportValidityNote}</li>
          <li>Budget expectations: {destination.budgetBand} baseline in current planning cycle.</li>
          <li>Local rules reminder: {destination.localRules[0] ?? 'Review local guidance before departure.'}</li>
          <li>Health and insurance reminder: {destination.healthSnapshot}</li>
        </ul>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Cost and stay signals</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl bg-white/85 p-4 text-sm text-navy-muted">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Daily budget band</p>
            <p className="mt-1 font-semibold text-navy">{dossier.dailyBudgetBand}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4 text-sm text-navy-muted">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Monthly stay estimate</p>
            <p className="mt-1 font-semibold text-navy">{dossier.monthlyStayEstimate}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4 text-sm text-navy-muted">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Internet / work fit</p>
            <p className="mt-1 font-semibold text-navy">{dossier.remoteWorkFit}</p>
          </article>
          <article className="rounded-2xl bg-white/85 p-4 text-sm text-navy-muted">
            <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Housing pressure</p>
            <p className="mt-1 font-semibold text-navy capitalize">{dossier.housingPressure}</p>
          </article>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-sky-accent/15 bg-sky-50/60 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Trust and freshness</div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft">
            Last checked: {new Date(lastChecked).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft">
            {dossier.sourceConfidenceLabel}
          </span>
          {trust ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft capitalize">
              Freshness: {trust.freshnessStatus}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-7 text-navy-muted">
          AtlasBrief provides planning intelligence, not official legal or immigration advice. Travelers should verify final requirements with official government or airline sources before booking or departure.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Take action</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void toggleSaved(destination)}
            className="inline-flex items-center gap-2 rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light"
          >
            <Bookmark className="h-4 w-4" />
            {saved ? 'Saved trip' : 'Save this trip'}
          </button>

          <button
            type="button"
            disabled={!isAuthenticated}
            onClick={() => void toggleWatchlist(destination)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <BellRing className="h-4 w-4" />
            {watched ? 'In watchlist' : 'Add to watchlist'}
          </button>

          <Link to="/compare" className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
            Compare destinations
          </Link>
          <Link to={`/stay-planner?dest=${destination.id}`} className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
            Create stay plan
          </Link>
          <Link to="/partners" className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
            View partner tools
          </Link>
        </div>
        {!isAuthenticated ? (
          <p className="mt-4 text-sm text-navy-muted">
            Create an account to sync watchlist and saved intelligence across devices. <Link to="/signup" className="font-semibold text-sky-accent">Sign up</Link> or <Link to="/login" className="font-semibold text-sky-accent">log in</Link>.
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.75rem] border border-amber-200/80 bg-amber-50/70 p-5 text-sm text-amber-900">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Dossiers are planning briefs. Verify requirements with official sources before booking or departure.
          </p>
        </div>
      </section>
    </div>
  );
};

export default DossierDetail;