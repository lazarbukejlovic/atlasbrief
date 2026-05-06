import type { PlanName } from '../context/AuthContext';

interface UserPlanBadgeProps {
  plan: PlanName;
}

const UserPlanBadge = ({ plan }: UserPlanBadgeProps) => {
  const tone =
    plan === 'Free'
      ? 'bg-sky-soft text-navy'
      : plan === 'Plus'
      ? 'bg-sand/20 text-navy'
      : plan === 'Pro'
      ? 'bg-navy text-white'
      : 'bg-amber-100 text-amber-900';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      Plan: {plan}
    </span>
  );
};

export default UserPlanBadge;
