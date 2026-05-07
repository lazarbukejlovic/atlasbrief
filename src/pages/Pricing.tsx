import { useState } from 'react';
import { Link } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import { useAuth } from '../hooks/useAuth';
import { startPlusCheckout } from '../lib/billing';
import { PLAN_LIMITS } from '../lib/planLimits';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handlePlusCheckout = async () => {
    try {
      setCheckoutError(null);
      setCheckoutLoading(true);
      await startPlusCheckout();
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Unable to open checkout right now.'
      );
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="glass-card rounded-[2rem] p-8 text-center md:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Pricing</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Trip readiness, at every budget</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-navy-muted">
          AtlasBrief helps travelers, remote workers, and business teams make confident destination decisions before booking. Choose a plan for your trip-readiness workflow and upgrade when your watchlist grows.
        </p>
        <p className="mx-auto mt-4 max-w-3xl rounded-2xl border border-sky-accent/20 bg-white/70 px-4 py-3 text-sm text-navy-muted">
          The subscription foundation is wired for test-mode checkout and billing management. Live payment activation is not enabled here.
        </p>
        {!isAuthenticated ? (
          <p className="mx-auto mt-4 max-w-3xl text-sm text-navy-muted">
            Log in or create an account before starting a Plus subscription. You can <Link to="/login" className="font-semibold text-sky-accent">log in</Link> or <Link to="/signup?plan=plus" className="font-semibold text-sky-accent">create your account</Link> first.
          </p>
        ) : null}
        {checkoutError ? (
          <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950">
            {checkoutError}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <PricingCard
          name="Free"
          price="$0"
          description="For first-time evaluators and occasional travelers."
          ctaLabel="Start free"
          ctaTo="/signup?plan=free"
          features={[
            `${PLAN_LIMITS.free} saved trip brief`,
            'Manual destination refresh',
            'Basic readiness scores',
            'Limited destination watch',
          ]}
        />
        <PricingCard
          name="Plus"
          price="$5/mo or $49/yr"
          description="For remote workers and frequent business travelers."
          ctaLabel={isAuthenticated ? (checkoutLoading ? 'Opening checkout...' : 'Upgrade to Plus') : 'Log in or sign up'}
          ctaTo={isAuthenticated ? undefined : '/signup?plan=plus'}
          onCtaClick={isAuthenticated ? () => void handlePlusCheckout() : undefined}
          ctaDisabled={checkoutLoading}
          featured
          features={[
            `${PLAN_LIMITS.plus} saved trip briefs`,
            'Destination watchlist expansion',
            'Daily destination brief foundation',
            'Priority readiness features',
            'Everything in Free',
          ]}
        />
        <PricingCard
          name="Pro"
          price="$9/mo or $89/yr"
          description="For families, teams, and extended stay planners."
          ctaLabel="Coming soon"
          onCtaClick={() => undefined}
          ctaDisabled
          features={[
            `${PLAN_LIMITS.pro} saved trips`,
            'Family sharing',
            'Compare destinations side-by-side',
            'Early 30–90 day stay planner',
            'Expanded readiness history',
            'Everything in Plus',
          ]}
        />
      </section>

      <section className="glass-card rounded-[2rem] border-2 border-sand/20 p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">B2B Widget</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Custom Pilot</h2>
            <p className="mt-4 text-base leading-8 text-navy-muted">
              Embed a white-label trip-readiness component into a travel platform, mobility workflow, or agency operations stack.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-sand font-bold">-</span>
                <span className="text-navy-muted">Embeddable trip-readiness component</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sand font-bold">-</span>
                <span className="text-navy-muted">White-label destination brief</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sand font-bold">-</span>
                <span className="text-navy-muted">Travel agency or mobility team use case</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sand font-bold">-</span>
                <span className="text-navy-muted">Partner redirect and visa integration ready later</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-sand/10 to-sky-accent/10 rounded-2xl p-6 flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sand mb-2">Pricing</div>
            <p className="text-4xl font-bold text-navy">Custom Pilot</p>
            <p className="mt-3 text-navy-muted text-sm">Contact us for a pilot engagement and pricing tailored to your use case.</p>
            <a href="/account?intent=pilot" className="mt-6 btn-sand rounded-xl py-3 text-center font-semibold">
              Request pilot
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-navy">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <details className="card-base p-4 cursor-pointer group">
            <summary className="font-semibold text-navy flex items-center justify-between">
              Can I cancel anytime?
              <span className="text-sky-accent group-open:rotate-180 transition">+</span>
            </summary>
            <p className="mt-3 text-navy-muted text-sm">
              Yes. Monthly subscribers can cancel at any time. Annual subscribers can also cancel; refunds are pro-rated for unused months.
            </p>
          </details>
          <details className="card-base p-4 cursor-pointer group">
            <summary className="font-semibold text-navy flex items-center justify-between">
              Is data secure and private?
              <span className="text-sky-accent group-open:rotate-180 transition">+</span>
            </summary>
            <p className="mt-3 text-navy-muted text-sm">
              Logged-out watchlists stay in your browser. Logged-in saved briefs and billing status are scoped to your account with Supabase authentication and row-level access controls.
            </p>
          </details>
          <details className="card-base p-4 cursor-pointer group">
            <summary className="font-semibold text-navy flex items-center justify-between">
              How often is the data updated?
              <span className="text-sky-accent group-open:rotate-180 transition">+</span>
            </summary>
            <p className="mt-3 text-navy-muted text-sm">
              AtlasBrief currently uses demo intelligence and simulated readiness data. An official-source-first structure is planned in future builds.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
