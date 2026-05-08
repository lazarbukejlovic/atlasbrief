import { getDestinationTrustMetadata } from '../data/destinationTrust';
import {
  type Destination,
  destinations,
  getDestinationById,
  getDestinationReadinessScore,
} from '../data/destinations';
import { getLongStayData } from '../data/longStayData';

export interface DossierSnapshot {
  destination: Destination;
  slug: string;
  readinessScore: number;
  positioningLine: string;
  entryFriction: string;
  budgetLevel: string;
  safetySignal: string;
  remoteWorkFit: string;
  longStayFeasibility: string;
  dailyBudgetBand: string;
  monthlyStayEstimate: string;
  housingPressure: string;
  sourceConfidenceLabel: string;
}

const safetySignalLabel = (safetyScore: number) => {
  if (safetyScore >= 90) {
    return 'Low friction monitoring posture';
  }

  if (safetyScore >= 78) {
    return 'Standard review posture';
  }

  return 'Watch carefully and verify updates';
};

const entryFrictionLabel = (destination: Destination) => {
  const lower = destination.visaSnapshot.toLowerCase();
  if (lower.includes('visa-free') && lower.includes('90')) {
    return 'Visa-free short stay (90-day class), confirm final entry details.';
  }

  if (lower.includes('visa-free')) {
    return 'Lower entry friction for short stays, verify timeline and passport validity.';
  }

  return 'Moderate entry friction, verify requirements before booking.';
};

const remoteWorkFitLabel = (destination: Destination) => {
  if (destination.internetScore >= 92) {
    return 'High remote-work fit with strong internet reliability.';
  }

  if (destination.internetScore >= 80) {
    return 'Good remote-work fit for typical planning needs.';
  }

  return 'Mixed remote-work fit. Verify connectivity and workspace assumptions.';
};

const longStayFeasibilityLabel = (destinationId: string) => {
  const longStay = getLongStayData(destinationId);
  if (!longStay) {
    return 'Long-stay feasibility preview available after a planner check.';
  }

  if (longStay.visaComplexity === 'simple' && longStay.housingPressure !== 'high') {
    return 'Favorable 30-90 day planning profile with moderate friction.';
  }

  if (longStay.visaComplexity === 'complex' || longStay.housingPressure === 'high') {
    return 'Long-stay possible with tighter planning, housing, and rules review.';
  }

  return 'Balanced 30-90 day feasibility with moderate planning checks.';
};

const sourceConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.9) {
    return 'High source confidence';
  }

  if (confidence >= 0.82) {
    return 'Moderate-high source confidence';
  }

  return 'Moderate source confidence';
};

const deriveDailyBudgetBand = (monthlyCostEstimate: number) => {
  const low = Math.round((monthlyCostEstimate * 0.75) / 30);
  const high = Math.round((monthlyCostEstimate * 1.15) / 30);
  return `$${low}-$${high}/day`;
};

const derivePositioningLine = (destination: Destination) => {
  const primary = destination.bestFor[0]?.toLowerCase() ?? 'trip planning';
  return `${destination.city} is positioned for ${primary} with a readiness-first planning lens.`;
};

export const getDossierSnapshotBySlug = (slug: string): DossierSnapshot | null => {
  const destination = getDestinationById(slug);
  if (!destination) {
    return null;
  }

  const longStay = getLongStayData(destination.id);
  const readinessScore = getDestinationReadinessScore(destination);

  return {
    destination,
    slug: destination.id,
    readinessScore,
    positioningLine: derivePositioningLine(destination),
    entryFriction: entryFrictionLabel(destination),
    budgetLevel: `${destination.costLevel} planning profile`,
    safetySignal: safetySignalLabel(destination.safetyScore),
    remoteWorkFit: remoteWorkFitLabel(destination),
    longStayFeasibility: longStayFeasibilityLabel(destination.id),
    dailyBudgetBand: deriveDailyBudgetBand(destination.monthlyCostEstimate),
    monthlyStayEstimate: `$${destination.monthlyCostEstimate.toLocaleString()}/month`,
    housingPressure: longStay ? `${longStay.housingPressure} housing pressure` : 'Moderate housing pressure',
    sourceConfidenceLabel: sourceConfidenceLabel(destination.sourceConfidence),
  };
};

export const getAllDossierSnapshots = (): DossierSnapshot[] =>
  destinations
    .map((destination) => getDossierSnapshotBySlug(destination.id))
    .filter((value): value is DossierSnapshot => Boolean(value));

export const getDossierLastChecked = (destinationId: string, fallback: string) => {
  const trust = getDestinationTrustMetadata(destinationId);
  return trust?.lastCheckedAt ?? fallback;
};
