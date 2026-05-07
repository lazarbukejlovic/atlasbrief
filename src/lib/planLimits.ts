export type BillingPlan = 'free' | 'plus' | 'pro';

export const PLAN_LIMITS: Record<BillingPlan, number> = {
  free: 1,
  plus: 5,
  pro: 20,
};

export function getSavedBriefLimit(plan: BillingPlan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function toBillingPlan(plan: string | null | undefined): BillingPlan {
  switch (plan?.toLowerCase()) {
    case 'plus':
      return 'plus';
    case 'pro':
      return 'pro';
    case 'free':
    default:
      return 'free';
  }
}

export function getSavedLimitMessage(plan: BillingPlan): string {
  if (plan === 'free') {
    return 'Free plan includes 1 saved trip. Upgrade to Plus for 5 saved trips.';
  }

  if (plan === 'plus') {
    return 'Plus plan includes 5 saved trips. Upgrade to Pro for 20 saved trips.';
  }

  return `Your current plan includes ${getSavedBriefLimit(plan)} saved trips. Remove a saved trip or upgrade to save more.`;
}