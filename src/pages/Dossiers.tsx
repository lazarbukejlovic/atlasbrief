import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';
import { getAllDossierSnapshots } from '../lib/dossiers';

const Dossiers = () => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const dossiers = useMemo(() => getAllDossierSnapshots(), []);

  const regions = useMemo(
    () => ['All', ...new Set(dossiers.map((item) => item.destination.region))],
    [dossiers]
  );

  const filtered = dossiers.filter((item) => {
    const matchesRegion = region === 'All' || item.destination.region === region;
    const normalized = query.trim().toLowerCase();
    const matchesQuery =
      normalized.length === 0 ||
      item.destination.city.toLowerCase().includes(normalized) ||
      item.destination.country.toLowerCase().includes(normalized);

    return matchesRegion && matchesQuery;
  });

  return (
    <div className="space-y-8">
      <SeoMeta
        title="Destination Dossiers | AtlasBrief"
        description="Browse AtlasBrief destination dossiers with trip readiness snapshots, budget signals, risk context, and trust/freshness notes before booking."
        canonicalPath="/dossiers"
      />

      <section className="glass-card rounded-[2rem] border border-sky-accent/20 p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Public destination dossiers</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Practical pre-trip readiness briefs, not generic travel guides.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          AtlasBrief dossiers focus on readiness signals before booking: entry friction, budget posture, safety/risk context, remote-work fit, and long-stay feasibility.
        </p>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Search destination or country</span>
            <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-soft">
              <Search className="h-4 w-4 text-navy-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Lisbon, Tokyo, Singapore..."
                className="w-full bg-transparent text-sm text-navy outline-none"
              />
            </div>
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Region filter</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-1.5 min-w-[220px] rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            >
              {regions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {filtered.map((dossier) => (
          <article key={dossier.slug} className="card-base rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">{dossier.destination.region}</p>
                <h2 className="mt-2 text-2xl font-semibold text-navy">
                  {dossier.destination.city}, {dossier.destination.country}
                </h2>
                <p className="mt-2 text-sm text-navy-muted">{dossier.positioningLine}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Readiness</p>
                <p className="mt-1 text-2xl font-semibold text-navy">{dossier.readinessScore}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-3 text-sm text-navy-muted">
                <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Budget band</p>
                <p className="mt-1 font-semibold text-navy">{dossier.destination.budgetBand}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 text-sm text-navy-muted">
                <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Risk signal</p>
                <p className="mt-1 font-semibold text-navy">{dossier.safetySignal}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 text-sm text-navy-muted">
                <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Remote-work fit</p>
                <p className="mt-1 font-semibold text-navy">{dossier.remoteWorkFit}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 text-sm text-navy-muted">
                <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Monthly stay estimate</p>
                <p className="mt-1 font-semibold text-navy">{dossier.monthlyStayEstimate}</p>
              </div>
            </div>

            <div className="mt-4">
              <Link
                to={`/dossiers/${dossier.slug}`}
                className="inline-flex rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light"
              >
                View dossier
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Dossiers;
