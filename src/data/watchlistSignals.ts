import {
  destinations,
  getDestinationReadinessScore,
  type Destination,
} from './destinations';

export type WatchSeverity = 'Low' | 'Watch' | 'Elevated';

export interface WatchlistSignal {
  destinationId: string;
  currencySignal: string;
  costTrend: string;
  safetySignal: string;
  localRulesVisaNote: string;
  updatedAt: string;
  activeSignals: number;
  severity: WatchSeverity;
}

export interface DestinationWatchlistRow {
  id?: string;
  user_id?: string;
  destination_id: string;
  destination_name: string;
  country: string;
  readiness_score: number;
  currency_signal: string;
  cost_trend: string;
  safety_signal: string;
  local_rules_note: string;
  severity: Lowercase<WatchSeverity>;
  last_updated_label: string;
  created_at?: string;
  updated_at?: string;
}

export const watchlistSignals: WatchlistSignal[] = [
  {
    destinationId: 'lisbon-portugal',
    currencySignal: 'EUR range stable vs USD over 14 days.',
    costTrend: 'Shoulder-season rentals easing around 3-5%.',
    safetySignal: 'Tourist core theft risk remains low-watch at tram hubs.',
    localRulesVisaNote: 'Schengen 90/180 timing remains the main planning constraint.',
    updatedAt: '2026-05-07T08:15:00.000Z',
    activeSignals: 2,
    severity: 'Watch',
  },
  {
    destinationId: 'tokyo-japan',
    currencySignal: 'JPY still favorable for USD business travelers.',
    costTrend: 'Hotel demand elevated around conference windows.',
    safetySignal: 'Very high baseline safety; no elevated alerts.',
    localRulesVisaNote: 'Short-stay entry remains straightforward for US passports.',
    updatedAt: '2026-05-07T06:40:00.000Z',
    activeSignals: 1,
    severity: 'Low',
  },
  {
    destinationId: 'dubai-uae',
    currencySignal: 'AED peg keeps exchange volatility minimal.',
    costTrend: 'Summer rate softening in central business hotels.',
    safetySignal: 'High safety baseline; behavior compliance remains important.',
    localRulesVisaNote: 'Seasonal etiquette and venue dress expectations still apply.',
    updatedAt: '2026-05-07T03:05:00.000Z',
    activeSignals: 2,
    severity: 'Watch',
  },
  {
    destinationId: 'singapore-singapore',
    currencySignal: 'SGD stable with low near-term volatility.',
    costTrend: 'Premium districts holding steady week-over-week.',
    safetySignal: 'No new safety escalations in business corridors.',
    localRulesVisaNote: 'Rule enforcement remains strict but predictable.',
    updatedAt: '2026-05-07T09:10:00.000Z',
    activeSignals: 1,
    severity: 'Low',
  },
  {
    destinationId: 'barcelona-spain',
    currencySignal: 'EUR stable; spend pressure mostly housing-led.',
    costTrend: 'Event-driven spikes expected in central districts.',
    safetySignal: 'Pickpocket activity still elevated in dense tourist routes.',
    localRulesVisaNote: 'Schengen timing and local tourist tax updates to monitor.',
    updatedAt: '2026-05-07T05:25:00.000Z',
    activeSignals: 3,
    severity: 'Elevated',
  },
  {
    destinationId: 'mexico-city-mexico',
    currencySignal: 'MXN mildly stronger this week vs USD.',
    costTrend: 'Neighborhood spread widening between Roma and Polanco.',
    safetySignal: 'Late-night transfer planning still marked as watch.',
    localRulesVisaNote: 'Tourist stay terms stable; neighborhood selection remains key.',
    updatedAt: '2026-05-07T04:10:00.000Z',
    activeSignals: 3,
    severity: 'Watch',
  },
  {
    destinationId: 'cape-town-south-africa',
    currencySignal: 'ZAR favorable for USD budgets, with daily swings.',
    costTrend: 'Power-backup properties carrying a premium.',
    safetySignal: 'Load-shedding and after-dark transport remain elevated signals.',
    localRulesVisaNote: 'Accommodation backup power checks remain mission-critical.',
    updatedAt: '2026-05-07T02:35:00.000Z',
    activeSignals: 4,
    severity: 'Elevated',
  },
  {
    destinationId: 'medellin-colombia',
    currencySignal: 'COP remains value-positive for USD earners.',
    costTrend: 'Nomad-heavy zones rising slightly month-over-month.',
    safetySignal: 'Neighborhood variance remains the top watch factor.',
    localRulesVisaNote: 'Standard tourist entry remains unchanged this cycle.',
    updatedAt: '2026-05-07T01:55:00.000Z',
    activeSignals: 3,
    severity: 'Watch',
  },
];

export const watchlistSignalMap = new Map(
  watchlistSignals.map((signal) => [signal.destinationId, signal])
);

export const getWatchlistSignal = (destinationId: string) =>
  watchlistSignalMap.get(destinationId);

export const getRelativeUpdateLabel = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Updated recently';
  }

  const now = new Date();
  const diffMs = Math.max(now.getTime() - parsed.getTime(), 0);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return 'Updated just now';
  }

  if (diffHours < 24) {
    return `Updated ${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'Updated today';
  }

  return `Updated ${diffDays}d ago`;
};

const getSeverity = (destination: Destination): WatchSeverity => {
  if (destination.readinessStatus === 'Watch Closely' || destination.safetyScore < 68) {
    return 'Elevated';
  }

  if (destination.readinessStatus === 'Review' || destination.costLevel === 'Premium') {
    return 'Watch';
  }

  return 'Low';
};

const getCurrencySignal = (destination: Destination) => {
  if (destination.currency.includes('Euro')) {
    return 'EUR remains stable against USD this week.';
  }

  if (destination.currency.includes('Japanese Yen')) {
    return 'JPY still looks favorable for USD-funded trips.';
  }

  if (destination.currency.includes('Dirham')) {
    return 'AED stays steady thanks to the USD peg.';
  }

  if (destination.currency.includes('Singapore Dollar')) {
    return 'SGD is trading in a tight range with low near-term volatility.';
  }

  if (destination.currency.includes('Peso')) {
    return 'Local currency remains supportive for USD travelers, with normal weekly movement.';
  }

  if (destination.currency.includes('Rand')) {
    return 'ZAR still gives strong buying power, though daily swings remain noticeable.';
  }

  return destination.exchangeNote;
};

const getCostTrend = (destination: Destination) => {
  if (destination.costLevel === 'Premium') {
    return 'Short-stay costs are slightly elevated near the central business districts.';
  }

  if (destination.costLevel === 'Balanced') {
    return 'Core districts are stable, with shoulder-season pricing softening outside the center.';
  }

  return 'Value remains strong, though best rates still depend on neighborhood selection.';
};

const getSafetySignal = (destination: Destination) => {
  if (destination.readinessStatus === 'Watch Closely') {
    return destination.advisoryNote.split('. ')[0] ?? 'Elevated caution advised in key travel corridors.';
  }

  if (destination.readinessStatus === 'Review') {
    return 'Normal urban caution advised, with a few conditions worth monitoring.';
  }

  return 'Baseline safety signals remain steady for normal city movement.';
};

const getLocalRulesNote = (destination: Destination) => {
  return destination.visaSnapshot || destination.localRules[0] || 'Entry and local rules remain stable for short stays.';
};

export const createWatchlistSignalRecord = (destination: Destination): DestinationWatchlistRow => {
  const severity = getSeverity(destination);

  return {
    destination_id: destination.id,
    destination_name: destination.city,
    country: destination.country,
    readiness_score: getDestinationReadinessScore(destination),
    currency_signal: getCurrencySignal(destination),
    cost_trend: getCostTrend(destination),
    safety_signal: getSafetySignal(destination),
    local_rules_note: getLocalRulesNote(destination),
    severity: severity.toLowerCase() as Lowercase<WatchSeverity>,
    last_updated_label: 'Updated today',
  };
};

export const getWatchlistIntelligencePreview = (destinationIds: string[]) => {
  const selectedIds = destinationIds.length > 0 ? destinationIds : destinations.slice(0, 3).map((item) => item.id);
  const signals = selectedIds
    .map((destinationId) => getWatchlistSignal(destinationId))
    .filter((signal): signal is WatchlistSignal => Boolean(signal));

  const topSignal = [...signals].sort((left, right) => right.activeSignals - left.activeSignals)[0] ?? null;
  return {
    signals,
    topSignal,
  };
};