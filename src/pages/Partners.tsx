import { BarChart3, Filter, Handshake, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import MonetizationDisclosure from '../components/MonetizationDisclosure';
import PartnerRedirectGrid from '../components/PartnerRedirectGrid';
import { partnerCategoryLabels, partnerOffers, type PartnerCategory } from '../data/partnerOffers';
import { getPartnerRedirectMetrics } from '../utils/redirectTracking';

const filterOptions: { value: 'all' | PartnerCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'stays', label: partnerCategoryLabels.stays },
  { value: 'flights', label: partnerCategoryLabels.flights },
  { value: 'insurance', label: partnerCategoryLabels.insurance },
  { value: 'visa-entry-help', label: partnerCategoryLabels['visa-entry-help'] },
  { value: 'remote-work-tools', label: partnerCategoryLabels['remote-work-tools'] },
  { value: 'local-transport', label: partnerCategoryLabels['local-transport'] },
];

const Partners = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | PartnerCategory>('all');
  const [refreshTick, setRefreshTick] = useState(0);

  const filteredOffers = useMemo(
    () => (activeFilter === 'all' ? partnerOffers : partnerOffers.filter((offer) => offer.category === activeFilter)),
    [activeFilter]
  );

  const metrics = useMemo(() => getPartnerRedirectMetrics(partnerOffers), [refreshTick]);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Partner Redirects</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Travel next steps, without losing readiness context
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          AtlasBrief helps you review readiness first, then points you to relevant external tools for stays, flights,
          insurance, entry help, and long-stay planning.
        </p>
      </section>

      <MonetizationDisclosure />

      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Partner categories</div>
              <h2 className="mt-2 text-2xl font-semibold text-navy">Find the right external tool</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy shadow-soft">
              <Filter className="h-3.5 w-3.5" />
              {filteredOffers.length} options
            </span>
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
                    : 'border border-white/70 bg-white/80 text-navy-muted hover:bg-white hover:text-navy'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <article className="glass-card rounded-[1.75rem] border border-sand/40 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Redirect readiness metrics</div>
          <h3 className="mt-2 text-xl font-semibold text-navy">Local prototype analytics</h3>
          <p className="mt-2 text-xs leading-6 text-navy-muted">
            Stored locally in your browser for prototype validation. These are not production analytics.
          </p>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Total partner clicks</p>
              <p className="mt-1 text-2xl font-semibold text-navy">{metrics.totalPartnerClicks}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Top clicked category</p>
              <p className="mt-1 text-sm font-semibold capitalize text-navy">{metrics.topClickedCategory.replace(/-/g, ' ')}</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-navy-muted">Last clicked partner</p>
              <p className="mt-1 text-sm font-semibold text-navy">{metrics.lastClickedPartner}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <PartnerRedirectGrid
          offers={filteredOffers}
          onRedirect={() => {
            setRefreshTick((current) => current + 1);
          }}
        />
      </section>

      <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Product strategy</div>
        <h2 className="mt-3 text-2xl font-semibold text-navy">Why redirects, not native booking?</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border border-white/70 bg-white/80 p-4">
            <div className="inline-flex rounded-xl bg-sky-soft p-2 text-sky-accent">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-navy">Readiness intelligence stays core</h3>
            <p className="mt-1 text-sm text-navy-muted">AtlasBrief remains focused on trust, freshness, and decision context before purchase.</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-white/80 p-4">
            <div className="inline-flex rounded-xl bg-sky-soft p-2 text-sky-accent">
              <Handshake className="h-4 w-4" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-navy">External comparison flexibility</h3>
            <p className="mt-1 text-sm text-navy-muted">Users can compare multiple providers externally without locking into one booking stack.</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-white/80 p-4">
            <div className="inline-flex rounded-xl bg-sky-soft p-2 text-sky-accent">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-navy">Lower complexity during product growth</h3>
            <p className="mt-1 text-sm text-navy-muted">Redirect-based surfaces avoid premature native booking complexity while monetization paths are validated.</p>
          </article>

          <article className="rounded-2xl border border-white/70 bg-white/80 p-4">
            <div className="inline-flex rounded-xl bg-sky-soft p-2 text-sky-accent">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-navy">Trust remains conservative</h3>
            <p className="mt-1 text-sm text-navy-muted">AtlasBrief does not complete bookings and does not replace official visa, insurance, or travel guidance.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Partners;