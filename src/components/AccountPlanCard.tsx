import { Link } from 'react-router-dom';
import type { PlanName } from '../context/AuthContext';
import UserPlanBadge from './UserPlanBadge';

interface AccountPlanCardProps {
  plan: PlanName;
  savedCount: number;
  savedLimit: number | 'Custom';
  subscriptionStatus: string;
  cancelAtPeriodEnd?: boolean;
  cancelDateLabel?: string | null;
  billingError: string | null;
  showManageBilling: boolean;
  portalLoading: boolean;
  checkoutLoading: boolean;
  onManageBilling: () => void;
  onUpgrade: () => void;
}

const AccountPlanCard = ({
  plan,
  savedCount,
  savedLimit,
  subscriptionStatus,
  cancelAtPeriodEnd = false,
  cancelDateLabel = null,
  billingError,
  showManageBilling,
  portalLoading,
  checkoutLoading,
  onManageBilling,
  onUpgrade,
}: AccountPlanCardProps) => {
  const usageLabel =
    savedLimit === 'Custom' ? `${savedCount} tracked` : `${savedCount}/${savedLimit} used`;
  const savedLimitLabel = savedLimit === 'Custom' ? 'Custom' : `${savedLimit} saved trips`;

  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-navy">Account Plan</h2>
        <UserPlanBadge plan={plan} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="card-base p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-muted">Saved brief usage</p>
          <p className="mt-2 text-lg font-semibold text-navy">{usageLabel}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-muted">Saved trip limit</p>
          <p className="mt-2 text-lg font-semibold text-navy">{savedLimitLabel}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-muted">Subscription status</p>
          <p className="mt-2 text-lg font-semibold capitalize text-navy">{subscriptionStatus}</p>
        </div>
      </div>

      {plan === 'Free' ? (
        <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-white/70 p-4 text-sm text-navy-muted">
          Upgrade to Plus to unlock higher saved brief limits and additional features.
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm">
          <span className="font-medium text-emerald-800">{plan} plan active.</span>{' '}
          <span className="text-emerald-700">Your subscription is confirmed. Manage or cancel anytime via the billing portal.</span>
        </div>
      )}

      {(plan === 'Plus' || plan === 'Pro') && cancelAtPeriodEnd && cancelDateLabel ? (
        <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-sky-50/70 p-4 text-sm text-navy-muted">
          <p className="font-medium text-navy">Your {plan} plan is active until {cancelDateLabel}.</p>
          <p className="mt-1 text-xs text-navy-muted">Cancels on {cancelDateLabel}</p>
        </div>
      ) : null}

      {billingError ? (
        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {billingError}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pricing" className="btn-secondary px-5 py-2.5 text-sm">
          View plans
        </Link>
        {plan === 'Free' ? (
          <button type="button" className="btn-primary px-5 py-2.5 text-sm" onClick={onUpgrade} disabled={checkoutLoading}>
            {checkoutLoading ? 'Opening checkout...' : 'Upgrade to Plus'}
          </button>
        ) : null}
        {showManageBilling ? (
          <button type="button" className="btn-primary px-5 py-2.5 text-sm" onClick={onManageBilling} disabled={portalLoading}>
            {portalLoading ? 'Opening billing...' : 'Manage billing'}
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default AccountPlanCard;
