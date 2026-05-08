export type BillingPlan = 'free' | 'plus' | 'pro';

export const PLAN_LIMITS: Record<BillingPlan, number> = {
  free: 1,
  plus: 5,
  pro: 20,
};

export const WATCHLIST_LIMITS: Record<BillingPlan, number> = {
  free: 3,
  plus: 15,
  pro: 15,
};

export const STAY_PLAN_LIMITS: Record<BillingPlan, number> = {
  free: 1,
  plus: 5,
  pro: 20,
};

export function getSavedBriefLimit(plan: BillingPlan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function getWatchlistLimit(plan: BillingPlan) {
  return WATCHLIST_LIMITS[plan] ?? WATCHLIST_LIMITS.free;
}

export function getStayPlanLimit(plan: BillingPlan) {
  return STAY_PLAN_LIMITS[plan] ?? STAY_PLAN_LIMITS.free;
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
    return 'Plus plan includes 5 saved trips.';
  }

  return `Your current plan includes ${getSavedBriefLimit(plan)} saved trips. Remove a saved trip or upgrade to save more.`;
}

export function getWatchlistLimitMessage(plan: BillingPlan): string {
  if (plan === 'free') {
    return 'Free plan includes 3 watched destinations. Upgrade to Plus for 15.';
  }

  if (plan === 'plus') {
    return 'Plus plan includes 15 watched destinations.';
  }

  return `Your current plan includes ${getWatchlistLimit(plan)} watched destinations.`;
}

export function getStayPlanLimitMessage(plan: BillingPlan): string {
  const limit = getStayPlanLimit(plan);

  if (plan === 'plus') {
    return 'Plus includes 5 saved stay plans. Remove one to save another.';
  }

  return `Your current plan includes ${limit} saved stay plans. Remove one or upgrade to save more.`;
}