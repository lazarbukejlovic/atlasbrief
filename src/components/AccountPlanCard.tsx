import { Link } from 'react-router-dom';
import type { PlanName } from '../context/AuthContext';
import UserPlanBadge from './UserPlanBadge';

interface AccountPlanCardProps {
  plan: PlanName;
  savedCount: number;
  savedLimit: number | 'Custom';
}

const AccountPlanCard = ({ plan, savedCount, savedLimit }: AccountPlanCardProps) => {
  const usageLabel =
    savedLimit === 'Custom' ? `${savedCount} tracked` : `${savedCount}/${savedLimit} used`;

  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-navy">Account Plan</h2>
        <UserPlanBadge plan={plan} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="card-base p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-muted">Saved brief usage</p>
          <p className="mt-2 text-lg font-semibold text-navy">{usageLabel}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-muted">Subscription status</p>
          <p className="mt-2 text-lg font-semibold text-navy">Placeholder until Stripe phase</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-white/70 p-4 text-sm text-navy-muted">
        Stripe checkout and subscription management are planned for the next build phase.
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pricing" className="btn-secondary px-5 py-2.5 text-sm">
          View plans
        </Link>
        <button type="button" className="btn-primary px-5 py-2.5 text-sm" disabled>
          Customer portal (planned)
        </button>
      </div>
    </section>
  );
};

export default AccountPlanCard;
