import { Mail, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import AccountPlanCard from '../components/AccountPlanCard';
import { useAtlasBrief } from '../components/AppLayout';
import { useAuth } from '../hooks/useAuth';
import { openBillingPortal, startPlusCheckout } from '../lib/billing';

const Account = () => {
  const {
    user,
    currentPlan,
    planDetails,
    billingProfile,
    billingLoading,
    refreshBilling,
    signOut,
  } = useAuth();
  const { savedBriefs } = useAtlasBrief();
  const [billingError, setBillingError] = useState<string | null>(null);
  const [billingAction, setBillingAction] = useState<'checkout' | 'portal' | null>(null);

  const subscriptionStatus = useMemo(() => {
    if (billingLoading) {
      return 'Loading...';
    }

    return billingProfile?.subscription_status ?? 'inactive';
  }, [billingLoading, billingProfile?.subscription_status]);

  const cancelNoticeDateLabel = useMemo(() => {
    const value = billingProfile?.current_period_end ?? billingProfile?.cancel_at ?? null;
    if (!value) {
      return null;
    }

    const parsed = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [billingProfile?.cancel_at, billingProfile?.current_period_end]);

  const isActivePaidPlan =
    (currentPlan === 'Plus' || currentPlan === 'Pro') && subscriptionStatus === 'active';

  const cancellationScheduled = Boolean(
    billingProfile?.cancel_at_period_end ||
      billingProfile?.cancel_at ||
      (billingProfile?.current_period_end && subscriptionStatus === 'active')
  );

  const overLimit =
    typeof planDetails.savedBriefLimit === 'number' &&
    savedBriefs.length > planDetails.savedBriefLimit;

  const handleUpgrade = async () => {
    try {
      setBillingError(null);
      setBillingAction('checkout');
      await refreshBilling();
      await startPlusCheckout();
    } catch (error) {
      setBillingError(
        error instanceof Error ? error.message : 'Unable to open checkout right now.'
      );
      setBillingAction(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      setBillingError(null);
      setBillingAction('portal');
      await refreshBilling();
      await openBillingPortal();
    } catch (error) {
      setBillingError(
        error instanceof Error ? error.message : 'Unable to open billing right now.'
      );
      setBillingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Account</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Your readiness workspace account
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
          Your account will power saved briefs, alerts, and subscription access.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-sky-accent" />
            <h2 className="text-lg font-semibold text-navy">Profile</h2>
          </div>
          <p className="mt-4 text-sm text-navy-muted">Email</p>
          <p className="text-lg font-semibold text-navy">{user?.email ?? 'Unknown user'}</p>
          <p className="mt-4 text-xs text-navy-muted">
            Save trip briefs across devices and track what changed before you book.
          </p>
        </div>

        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-sand" />
            <h2 className="text-lg font-semibold text-navy">Subscription access</h2>
          </div>
          <p className="mt-4 text-sm text-navy-muted">Status</p>
          <p className="text-lg font-semibold capitalize text-navy">{subscriptionStatus}</p>
          <p className="mt-4 text-xs text-navy-muted">
            Billing status is read from your account profile. Missing billing data safely falls back to the Free plan until a billing record exists.
          </p>
          <button type="button" onClick={() => void signOut()} className="btn-secondary mt-6 px-5 py-2.5 text-sm">
            Logout
          </button>
        </div>
      </section>

      <AccountPlanCard
        plan={currentPlan}
        savedCount={savedBriefs.length}
        savedLimit={planDetails.savedBriefLimit}
        subscriptionStatus={subscriptionStatus}
        cancelAtPeriodEnd={isActivePaidPlan && cancellationScheduled}
        cancelDateLabel={cancelNoticeDateLabel}
        billingError={billingError}
        showManageBilling={Boolean(billingProfile?.stripe_customer_id)}
        portalLoading={billingAction === 'portal'}
        checkoutLoading={billingAction === 'checkout'}
        onManageBilling={() => void handleManageBilling()}
        onUpgrade={() => void handleUpgrade()}
      />

      {overLimit ? (
        <section className="rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          You currently have more saved trips than your plan allows. Existing trips remain available, but new saves are blocked until you remove some or upgrade.
        </section>
      ) : null}
    </div>
  );
};

export default Account;
