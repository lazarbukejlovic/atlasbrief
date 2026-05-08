import { Link } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta';

const About = () => {
  return (
    <div className="space-y-8">
      <SeoMeta
        title="About AtlasBrief | Trip Readiness Platform"
        description="Learn how AtlasBrief helps travelers evaluate destination readiness, cost, risk signals, and trust/freshness before booking."
        canonicalPath="/about"
      />

      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">About AtlasBrief</div>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          A Trip Readiness Assistant for travelers who want clarity before they land.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-navy-muted">
          Travel information is fragmented and changes quickly. AtlasBrief consolidates destination rules, costs, safety signals, and local context into a clear pre-trip readiness brief. It is built for the question that happens before booking: "Can I go, what will it cost, and what changed since I last checked?"
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">The Problem We Solve</div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-navy-muted">
            <p>Planning a trip abroad means researching visa requirements, understanding local rules, checking safety advisories, comparing costs, and tracking currency rates across disconnected websites and guides.</p>
            <p>Worse, this information changes: visa policies shift, safety conditions update, costs move with exchange rates. Most travelers check once, then book. By trip time, something has changed.</p>
          </div>
        </div>
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Why AtlasBrief Exists</div>
          <div className="mt-5 space-y-4 text-sm leading-7 text-navy-muted">
            <p>We built AtlasBrief to consolidate the pre-trip decision framework. Save a destination, and revisit it anytime. See what changed. Understand entry readiness, estimated costs, safety signals, and local context in one brief.</p>
            <p>It is web-first, utility-first, and designed to feel like a serious travel-tech product, not a blog.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card-base p-6">
          <div className="text-2xl font-bold text-sky-accent mb-2">Can I go?</div>
          <p className="text-sm text-navy-muted">Entry requirements, visa status, passport validity, health notes. Readiness briefs consolidate the documents you need.</p>
        </div>
        <div className="card-base p-6">
          <div className="text-2xl font-bold text-sand mb-2">What will it cost?</div>
          <p className="text-sm text-navy-muted">Budget bands, currency context, monthly estimates. Compare costs across destinations before committing.</p>
        </div>
        <div className="card-base p-6">
          <div className="text-2xl font-bold text-teal-500 mb-2">What changed?</div>
          <p className="text-sm text-navy-muted">Track updates to rules, safety scores, and costs. Never be surprised by a rule change on arrival day.</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-navy">Who We Serve</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-base p-6">
            <h3 className="font-semibold text-navy mb-3">Business Travelers</h3>
            <p className="text-sm text-navy-muted">Sanity-check landing conditions, understand meeting dress codes, know local holidays and customs. Plan with confidence.</p>
          </div>
          <div className="card-base p-6">
            <h3 className="font-semibold text-navy mb-3">Remote Workers & Digital Nomads</h3>
            <p className="text-sm text-navy-muted">Compare operating environments: internet speed, transit quality, cost of living, timezone fit. Find the right long-stay destination.</p>
          </div>
          <div className="card-base p-6">
            <h3 className="font-semibold text-navy mb-3">Extended Stay Planners</h3>
            <p className="text-sm text-navy-muted">Save 5-10 cities and compare them systematically. Monitor changes over weeks or months. Book when you are confident.</p>
          </div>
          <div className="card-base p-6">
            <h3 className="font-semibold text-navy mb-3">Travel Teams & Mobility</h3>
            <p className="text-sm text-navy-muted">HR, travel management, and relocation professionals use AtlasBrief to baseline destinations for employees and candidates.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-navy">Current State & Roadmap</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-base p-6 border-2 border-sky-accent/30">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent mb-3">Today</div>
            <ul className="space-y-2 text-sm text-navy-muted">
              <li>- 8 carefully curated destinations</li>
              <li>- Demo intelligence and simulated readiness data</li>
              <li>- Readiness briefs and watchlist</li>
              <li>- Change tracking with demo scenarios</li>
              <li>- Cost, safety, and rule context</li>
            </ul>
          </div>
          <div className="card-base p-6 border-2 border-sand/30">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sand mb-3">Roadmap</div>
            <ul className="space-y-2 text-sm text-navy-muted">
              <li>- Official-source-first requirement structure</li>
              <li>- Expanded partner visa and destination data</li>
              <li>- Partner redirects and booking handoff workflow</li>
              <li>- B2B embeddable trip-readiness widget</li>
              <li>- 30–90 day stay planner</li>
              <li>- Account and billing infrastructure</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-8 bg-amber-50/30 border-l-4 border-amber-400">
        <h2 className="text-2xl font-semibold text-amber-900 mb-3">Built Around Trust & Freshness</h2>
        <div className="space-y-4 text-sm text-amber-800">
          <p>
            <strong>Official sources first:</strong> Entry requirements and visa policy data come from official government and embassy sources where available.
          </p>
          <p>
            <strong>Demo intelligence now:</strong> Current briefs use simulated readiness data so experience, structure, and workflows can be evaluated clearly.
          </p>
          <p>
            <strong>Official-source-first structure planned:</strong> We are transparent about sourcing and roadmap status for each data layer.
          </p>
          <p>
            <strong>Conservative claims:</strong> We do not claim real-time integration with systems we have not verified. Current data is local/static; real APIs are on the roadmap.
          </p>
          <p>
            <strong>Important:</strong> AtlasBrief provides a travel-readiness summary, not official legal or immigration advice. Requirements and advisories can change quickly. Always verify current requirements with official sources before booking or traveling.
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Data & Trust</div>
        <h2 className="mt-3 text-3xl font-semibold text-navy">How AtlasBrief handles planning confidence</h2>
        <p className="mt-3 text-sm text-navy-muted">
          Browse public dossier examples to see this trust posture in destination-level practice.{' '}
          <Link to="/dossiers" className="font-semibold text-sky-accent">Open destination dossiers</Link>
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-navy-muted">
            <p className="font-semibold text-navy">Planning snapshots</p>
            <p className="mt-2 leading-7">AtlasBrief presents trip-readiness snapshots with clear freshness indicators to support planning decisions.</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-navy-muted">
            <p className="font-semibold text-navy">Official verification required</p>
            <p className="mt-2 leading-7">Always verify visa, entry, tax, insurance, and safety requirements with official sources before booking.</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-navy-muted">
            <p className="font-semibold text-navy">Estimated cost layers</p>
            <p className="mt-2 leading-7">Cost and long-stay estimates are informational and static in this phase, designed for readiness comparison rather than checkout accuracy.</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-navy-muted">
            <p className="font-semibold text-navy">Roadmap direction</p>
            <p className="mt-2 leading-7">Future provider-grade integrations may include Timatic/Sherpa-style requirement layers, but those feeds are not active in this release.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
