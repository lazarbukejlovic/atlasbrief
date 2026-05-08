import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { getDestinationById, getDestinationReadinessScore, type Destination } from '../data/destinations';
import { getDestinationUpdates, type TravelIntelligenceUpdate, type UpdateSeverity } from '../data/travelIntelligenceUpdates';
import { getRelativeUpdateLabel, getWatchlistSignal, type DestinationWatchlistRow, type WatchSeverity } from '../data/watchlistSignals';
import type { SavedBrief } from '../hooks/useSavedBriefs';
import type { SavedStayPlan } from '../hooks/useStayPlans';

export type AlertType =
  | 'requirement_update'
  | 'cost_change'
  | 'safety_watch'
  | 'currency_update'
  | 'freshness_review'
  | 'stay_plan_review'
  | 'watchlist_signal'
  | 'compare_signal';

export type AlertSeverity = 'info' | 'watch' | 'important';
export type AlertFilter =
  | 'all'
  | 'unread'
  | 'important'
  | 'watch'
  | 'requirements'
  | 'cost'
  | 'safety'
  | 'currency'
  | 'freshness';

export interface TravelAlert {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  type: AlertType;
  typeLabel: string;
  severity: AlertSeverity;
  message: string;
  date: string;
  sourceNote: string;
  ctaLabel: string;
  ctaTo: string;
  category: Exclude<AlertFilter, 'all' | 'unread' | 'important' | 'watch'> | 'general';
}

interface BuildAlertsInput {
  destinations: Destination[];
  savedBriefs: SavedBrief[];
  watchlist: DestinationWatchlistRow[];
  stayPlans: SavedStayPlan[];
}

const updateTypeLabelMap: Record<AlertType, string> = {
  requirement_update: 'Requirements update',
  cost_change: 'Cost change',
  safety_watch: 'Safety watch',
  currency_update: 'Currency update',
  freshness_review: 'Freshness review',
  stay_plan_review: 'Stay plan review',
  watchlist_signal: 'Watchlist signal',
  compare_signal: 'Compare signal',
};

const sourceTierLabel = (tier?: string) => {
  if (!tier) {
    return 'Planning snapshot';
  }

  return tier === 'official'
    ? 'Official source structure'
    : tier === 'partner'
      ? 'Partner-verified snapshot'
      : tier === 'estimated'
        ? 'Estimated planning snapshot'
        : 'Demo planning snapshot';
};

const trustFreshnessLabel = (freshness?: string) => {
  if (!freshness) {
    return 'Freshness unknown';
  }

  return freshness === 'current'
    ? 'Current'
    : freshness === 'review-soon'
      ? 'Review soon'
      : 'Stale';
};

const mapUpdateSeverity = (severity: UpdateSeverity): AlertSeverity => severity;

const mapWatchSeverity = (severity: WatchSeverity): AlertSeverity => {
  if (severity === 'Elevated') {
    return 'important';
  }

  if (severity === 'Watch') {
    return 'watch';
  }

  return 'info';
};

const getAlertCategory = (type: AlertType): TravelAlert['category'] => {
  if (type === 'requirement_update') return 'requirements';
  if (type === 'cost_change') return 'cost';
  if (type === 'currency_update') return 'currency';
  if (type === 'safety_watch' || type === 'watchlist_signal' || type === 'compare_signal') return 'safety';
  if (type === 'freshness_review' || type === 'stay_plan_review') return 'freshness';
  return 'general';
};

const mapChangeTypeToAlertType = (update: TravelIntelligenceUpdate): AlertType => {
  if (update.changeType === 'Requirements') return 'requirement_update';
  if (update.changeType === 'Cost') return 'cost_change';
  if (update.changeType === 'FX') return 'currency_update';
  if (update.changeType === 'Safety') return 'safety_watch';
  if (update.changeType === 'Freshness') return 'freshness_review';
  return 'watchlist_signal';
};

const getDefaultCta = (destinationId: string, isWatched: boolean, isSaved: boolean, hasStayPlans: boolean) => {
  if (hasStayPlans) {
    return { ctaLabel: 'Open stay planner', ctaTo: `/stay-planner?dest=${destinationId}` };
  }

  if (isWatched) {
    return { ctaLabel: 'Open watchlist', ctaTo: '/watchlist' };
  }

  if (isSaved) {
    return { ctaLabel: 'Review saved brief', ctaTo: '/saved' };
  }

  return { ctaLabel: 'Open destination', ctaTo: `/destinations/${destinationId}` };
};

export interface BuildAlertsResult {
  alerts: TravelAlert[];
  monitoredDestinationIds: string[];
}

export const buildTravelAlerts = ({
  destinations,
  savedBriefs,
  watchlist,
  stayPlans,
}: BuildAlertsInput): BuildAlertsResult => {
  const destinationMap = new Map(destinations.map((destination) => [destination.id, destination]));
  const savedIdSet = new Set(savedBriefs.map((brief) => brief.destination_id));
  const watchlistIdSet = new Set(watchlist.map((row) => row.destination_id));
  const stayPlanCounts = stayPlans.reduce<Record<string, number>>((accumulator, plan) => {
    accumulator[plan.destination_id] = (accumulator[plan.destination_id] ?? 0) + 1;
    return accumulator;
  }, {});

  const monitoredDestinationIds = Array.from(
    new Set([
      ...savedBriefs.map((brief) => brief.destination_id),
      ...watchlist.map((row) => row.destination_id),
      ...stayPlans.map((plan) => plan.destination_id),
    ])
  );

  const alerts: TravelAlert[] = [];

  monitoredDestinationIds.forEach((destinationId) => {
    const destination = destinationMap.get(destinationId) ?? getDestinationById(destinationId);
    if (!destination) {
      return;
    }

    const trust = getDestinationTrustMetadata(destinationId);
    const watchSignal = getWatchlistSignal(destinationId);
    const updates = getDestinationUpdates(destinationId, 2);
    const isSaved = savedIdSet.has(destinationId);
    const isWatched = watchlistIdSet.has(destinationId);
    const planCount = stayPlanCounts[destinationId] ?? 0;
    const hasStayPlans = planCount > 0;
    const defaultCta = getDefaultCta(destinationId, isWatched, isSaved, hasStayPlans);

    updates.forEach((update) => {
      const type = mapChangeTypeToAlertType(update);
      alerts.push({
        id: `update-${update.id}`,
        destinationId,
        destinationName: destination.city,
        country: destination.country,
        type,
        typeLabel: updateTypeLabelMap[type],
        severity: mapUpdateSeverity(update.severity),
        message: update.message,
        date: update.date,
        sourceNote: trust
          ? `${sourceTierLabel(trust.sourceTier)} · ${trustFreshnessLabel(trust.freshnessStatus)}`
          : 'Static planning update',
        ctaLabel: type === 'requirement_update' || type === 'cost_change' || type === 'currency_update' || type === 'safety_watch'
          ? 'Open destination'
          : defaultCta.ctaLabel,
        ctaTo: type === 'requirement_update' || type === 'cost_change' || type === 'currency_update' || type === 'safety_watch'
          ? `/destinations/${destinationId}`
          : defaultCta.ctaTo,
        category: getAlertCategory(type),
      });
    });

    if (trust && trust.freshnessStatus !== 'current') {
      alerts.push({
        id: `freshness-${destinationId}`,
        destinationId,
        destinationName: destination.city,
        country: destination.country,
        type: 'freshness_review',
        typeLabel: updateTypeLabelMap.freshness_review,
        severity: trust.freshnessStatus === 'stale' ? 'important' : 'watch',
        message:
          trust.freshnessStatus === 'stale'
            ? `${destination.city} needs a fresh planning review before booking.`
            : `${destination.city} is approaching its next review window.`,
        date: trust.nextReviewDue,
        sourceNote: `Last checked ${new Date(trust.lastCheckedAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })} · ${sourceTierLabel(trust.sourceTier)}`,
        ctaLabel: hasStayPlans ? 'Open stay planner' : isSaved ? 'Review saved brief' : 'Open destination',
        ctaTo: hasStayPlans ? `/stay-planner?dest=${destinationId}` : isSaved ? '/saved' : `/destinations/${destinationId}`,
        category: 'freshness',
      });
    }

    if (hasStayPlans && trust && trust.freshnessStatus !== 'current') {
      alerts.push({
        id: `stay-plan-${destinationId}`,
        destinationId,
        destinationName: destination.city,
        country: destination.country,
        type: 'stay_plan_review',
        typeLabel: updateTypeLabelMap.stay_plan_review,
        severity: trust.freshnessStatus === 'stale' ? 'important' : 'watch',
        message: `${planCount} saved stay plan${planCount > 1 ? 's may' : ' may'} need a fresh review for ${destination.city}.`,
        date: trust.nextReviewDue,
        sourceNote: `Stay planner snapshot uses ${trustFreshnessLabel(trust.freshnessStatus).toLowerCase()} destination metadata.`,
        ctaLabel: 'Open stay planner',
        ctaTo: `/stay-planner?dest=${destinationId}`,
        category: 'freshness',
      });
    }

    if (watchSignal && isWatched) {
      alerts.push({
        id: `watchlist-${destinationId}`,
        destinationId,
        destinationName: destination.city,
        country: destination.country,
        type: 'watchlist_signal',
        typeLabel: updateTypeLabelMap.watchlist_signal,
        severity: mapWatchSeverity(watchSignal.severity),
        message: `${watchSignal.activeSignals} active planning signals are being tracked for ${destination.city}.`,
        date: watchSignal.updatedAt,
        sourceNote: `${watchSignal.safetySignal} · ${getRelativeUpdateLabel(watchSignal.updatedAt)}`,
        ctaLabel: 'Open watchlist',
        ctaTo: '/watchlist',
        category: 'safety',
      });
    }

    if (watchSignal && getDestinationReadinessScore(destination) >= 80 && mapWatchSeverity(watchSignal.severity) !== 'info') {
      alerts.push({
        id: `compare-${destinationId}`,
        destinationId,
        destinationName: destination.city,
        country: destination.country,
        type: 'compare_signal',
        typeLabel: updateTypeLabelMap.compare_signal,
        severity: mapWatchSeverity(watchSignal.severity),
        message: `${destination.city} still compares well on readiness, but active watch signals mean it should be checked against alternatives before booking.`,
        date: watchSignal.updatedAt,
        sourceNote: `${watchSignal.costTrend} · Compare before you commit.`,
        ctaLabel: 'Open compare',
        ctaTo: '/compare',
        category: 'safety',
      });
    }
  });

  return {
    alerts: alerts.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()),
    monitoredDestinationIds,
  };
};