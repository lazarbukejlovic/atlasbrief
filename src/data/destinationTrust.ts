export type SourceTier = 'official' | 'partner' | 'estimated' | 'demo';
export type FreshnessStatus = 'current' | 'review-soon' | 'stale';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface DestinationTrustMetadata {
  destinationId: string;
  lastCheckedAt: string;
  nextReviewDue: string;
  sourceTier: SourceTier;
  sourceSummary: string;
  sourceNotes: string[];
  freshnessStatus: FreshnessStatus;
  confidenceLevel: ConfidenceLevel;
  advisoryUpdatedAt: string;
  costDataUpdatedAt: string;
  fxDataUpdatedAt: string;
  requirementsUpdatedAt: string;
}

const destinationTrustMap: Record<string, DestinationTrustMetadata> = {
  'lisbon-portugal': {
    destinationId: 'lisbon-portugal',
    lastCheckedAt: '2026-05-02T09:10:00Z',
    nextReviewDue: '2026-05-16T09:00:00Z',
    sourceTier: 'official',
    sourceSummary: 'Schengen and Portugal entry guidance reviewed against official channels with partner context for operational notes.',
    sourceNotes: ['Government and embassy requirement pages reviewed', 'Partner logistics context used for city-level operational notes'],
    freshnessStatus: 'current',
    confidenceLevel: 'high',
    advisoryUpdatedAt: '2026-05-01T14:00:00Z',
    costDataUpdatedAt: '2026-04-29T13:30:00Z',
    fxDataUpdatedAt: '2026-05-02T08:30:00Z',
    requirementsUpdatedAt: '2026-05-02T09:10:00Z',
  },
  'tokyo-japan': {
    destinationId: 'tokyo-japan',
    lastCheckedAt: '2026-05-01T08:20:00Z',
    nextReviewDue: '2026-05-15T08:00:00Z',
    sourceTier: 'official',
    sourceSummary: 'Japan temporary visitor snapshots reviewed against official sources with partner context for business travel operations.',
    sourceNotes: ['Official immigration and embassy pages reviewed', 'Partner datasets used for city operations and transport confidence'],
    freshnessStatus: 'current',
    confidenceLevel: 'high',
    advisoryUpdatedAt: '2026-04-30T16:10:00Z',
    costDataUpdatedAt: '2026-04-27T12:00:00Z',
    fxDataUpdatedAt: '2026-05-01T08:00:00Z',
    requirementsUpdatedAt: '2026-05-01T08:20:00Z',
  },
  'dubai-uae': {
    destinationId: 'dubai-uae',
    lastCheckedAt: '2026-04-27T10:00:00Z',
    nextReviewDue: '2026-05-10T10:00:00Z',
    sourceTier: 'partner',
    sourceSummary: 'Entry and stay snapshot reviewed with official references and partner operational notes for business travel.',
    sourceNotes: ['Official entry windows checked', 'Partner notes used for venue behavior expectations'],
    freshnessStatus: 'review-soon',
    confidenceLevel: 'medium',
    advisoryUpdatedAt: '2026-04-26T15:30:00Z',
    costDataUpdatedAt: '2026-04-24T12:40:00Z',
    fxDataUpdatedAt: '2026-04-27T09:50:00Z',
    requirementsUpdatedAt: '2026-04-27T10:00:00Z',
  },
  'singapore-singapore': {
    destinationId: 'singapore-singapore',
    lastCheckedAt: '2026-05-03T07:40:00Z',
    nextReviewDue: '2026-05-17T08:00:00Z',
    sourceTier: 'official',
    sourceSummary: 'Singapore visit pass and traveler planning snapshot reviewed with high-confidence source structure.',
    sourceNotes: ['Official ICA policy snapshots reviewed', 'Partner context added for cost and mobility usability'],
    freshnessStatus: 'current',
    confidenceLevel: 'high',
    advisoryUpdatedAt: '2026-05-02T10:50:00Z',
    costDataUpdatedAt: '2026-04-30T10:10:00Z',
    fxDataUpdatedAt: '2026-05-03T07:20:00Z',
    requirementsUpdatedAt: '2026-05-03T07:40:00Z',
  },
  'barcelona-spain': {
    destinationId: 'barcelona-spain',
    lastCheckedAt: '2026-04-25T11:00:00Z',
    nextReviewDue: '2026-05-08T11:00:00Z',
    sourceTier: 'partner',
    sourceSummary: 'Schengen baseline is stable; city-level advisory and cost pressure snapshots rely on mixed official and partner sources.',
    sourceNotes: ['Official Schengen stay windows reviewed', 'Partner and local reports used for petty theft and price pressure context'],
    freshnessStatus: 'review-soon',
    confidenceLevel: 'medium',
    advisoryUpdatedAt: '2026-04-24T13:20:00Z',
    costDataUpdatedAt: '2026-04-23T17:00:00Z',
    fxDataUpdatedAt: '2026-04-25T10:30:00Z',
    requirementsUpdatedAt: '2026-04-25T11:00:00Z',
  },
  'mexico-city-mexico': {
    destinationId: 'mexico-city-mexico',
    lastCheckedAt: '2026-04-26T12:15:00Z',
    nextReviewDue: '2026-05-09T12:00:00Z',
    sourceTier: 'partner',
    sourceSummary: 'Entry windows are stable but neighborhood-level practical guidance and cost context use partner/estimated inputs.',
    sourceNotes: ['Official entry window checked', 'Neighborhood guidance and operating assumptions are informational'],
    freshnessStatus: 'review-soon',
    confidenceLevel: 'medium',
    advisoryUpdatedAt: '2026-04-25T16:40:00Z',
    costDataUpdatedAt: '2026-04-22T11:00:00Z',
    fxDataUpdatedAt: '2026-04-26T11:50:00Z',
    requirementsUpdatedAt: '2026-04-26T12:15:00Z',
  },
  'cape-town-south-africa': {
    destinationId: 'cape-town-south-africa',
    lastCheckedAt: '2026-04-19T09:30:00Z',
    nextReviewDue: '2026-05-03T09:00:00Z',
    sourceTier: 'estimated',
    sourceSummary: 'Core entry snapshot is stable, but advisory and infrastructure reliability signals are higher-variance and informational.',
    sourceNotes: ['Official baseline entry checked', 'Load-shedding and local safety context are informational planning signals'],
    freshnessStatus: 'stale',
    confidenceLevel: 'low',
    advisoryUpdatedAt: '2026-04-18T14:20:00Z',
    costDataUpdatedAt: '2026-04-16T10:40:00Z',
    fxDataUpdatedAt: '2026-04-19T09:10:00Z',
    requirementsUpdatedAt: '2026-04-19T09:30:00Z',
  },
  'medellin-colombia': {
    destinationId: 'medellin-colombia',
    lastCheckedAt: '2026-04-18T10:20:00Z',
    nextReviewDue: '2026-05-02T10:00:00Z',
    sourceTier: 'estimated',
    sourceSummary: 'Tourist permit baseline is stable, but neighborhood-level safety and practical operating guidance are informational.',
    sourceNotes: ['Official permit window reviewed', 'Neighborhood and nightlife advisories are informational planning signals'],
    freshnessStatus: 'stale',
    confidenceLevel: 'low',
    advisoryUpdatedAt: '2026-04-17T15:40:00Z',
    costDataUpdatedAt: '2026-04-15T13:30:00Z',
    fxDataUpdatedAt: '2026-04-18T09:50:00Z',
    requirementsUpdatedAt: '2026-04-18T10:20:00Z',
  },
};

export const getDestinationTrustMetadata = (destinationId: string): DestinationTrustMetadata | null =>
  destinationTrustMap[destinationId] ?? null;

export const getFreshnessReviewHint = (freshness: FreshnessStatus): string | null => {
  if (freshness === 'current') {
    return null;
  }

  return 'Review before booking';
};

export const getTrustScore = (metadata: DestinationTrustMetadata): number => {
  const freshnessScore = metadata.freshnessStatus === 'current' ? 95 : metadata.freshnessStatus === 'review-soon' ? 72 : 48;
  const confidenceScore = metadata.confidenceLevel === 'high' ? 94 : metadata.confidenceLevel === 'medium' ? 73 : 52;
  const tierScore = metadata.sourceTier === 'official' ? 92 : metadata.sourceTier === 'partner' ? 76 : metadata.sourceTier === 'estimated' ? 60 : 45;

  return Math.round(freshnessScore * 0.4 + confidenceScore * 0.35 + tierScore * 0.25);
};
