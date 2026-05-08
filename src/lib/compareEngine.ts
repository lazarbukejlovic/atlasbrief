// Destination Compare / Decision Engine
// Weighted scoring system for comparing 2–3 destinations by travel mode.
// All scores are planning estimates only. Verify requirements with official sources before booking.

import type { Destination } from '../data/destinations';
import { getDestinationReadinessScore } from '../data/destinations';
import { getDestinationTrustMetadata, getTrustScore } from '../data/destinationTrust';
import type { LongStayDestinationData } from '../data/longStayData';
import { getLongStayData } from '../data/longStayData';

export type CompareMode = 'tourist' | 'remote-work' | 'business' | 'long-stay';

export const compareModeLabels: Record<CompareMode, string> = {
  tourist: 'Tourist Trip',
  'remote-work': 'Remote Work',
  business: 'Business Travel',
  'long-stay': '30–90 Day Stay',
};

export const compareModeDescriptions: Record<CompareMode, string> = {
  tourist: 'Weighted for safety, transport, entry friction, and short-trip cost.',
  'remote-work': 'Weighted for internet quality, cost, housing, and work infrastructure.',
  business: 'Weighted for transit reliability, infrastructure, safety, and planning confidence.',
  'long-stay': 'Weighted for monthly cost, visa complexity, housing pressure, healthcare, and internet.',
};

export interface DestinationCompareScore {
  destination: Destination;
  longStay: LongStayDestinationData;
  overallScore: number;
  readinessScore: number;
  safetyScore: number;
  internetScore: number;
  transportScore: number;
  costScore: number;
  trustScore: number;
  freshnessScore: number;
  visaScore: number;
  housingScore: number;
  healthcareScore: number;
  topStrengths: string[];
  mainCaution: string;
  costBand: string;
  monthlyCost: number;
}

export interface CompareInsight {
  type: 'winner' | 'value' | 'remote' | 'friction' | 'caution';
  label: string;
  destinationName: string;
  explanation: string;
}

export interface CompareResult {
  scores: DestinationCompareScore[];
  insights: CompareInsight[];
  bestMatch: DestinationCompareScore;
  bestValue: DestinationCompareScore;
  bestRemoteWork: DestinationCompareScore;
  lowestFriction: DestinationCompareScore;
  watchCarefully: DestinationCompareScore;
}

// --- Normalizers ---

/** Normalize a raw score (0–100) to 0–1 */
const norm = (value: number): number => Math.min(1, Math.max(0, value / 100));

/** Normalize an inverse cost score: lower monthly cost = higher score */
function normCostInverse(monthlyCost: number, allCosts: number[]): number {
  const min = Math.min(...allCosts);
  const max = Math.max(...allCosts);
  if (max === min) return 0.7;
  return 1 - (monthlyCost - min) / (max - min);
}

function visaComplexityToScore(complexity: LongStayDestinationData['visaComplexity']): number {
  return complexity === 'simple' ? 90 : complexity === 'moderate' ? 65 : 35;
}

function housingPressureToScore(pressure: LongStayDestinationData['housingPressure']): number {
  return pressure === 'low' ? 90 : pressure === 'moderate' ? 65 : 35;
}

function healthcareToScore(readiness: LongStayDestinationData['healthcareReadiness']): number {
  return readiness === 'strong' ? 92 : readiness === 'adequate' ? 70 : 45;
}

function freshnessToScore(status: 'current' | 'review-soon' | 'stale'): number {
  return status === 'current' ? 95 : status === 'review-soon' ? 65 : 30;
}

// --- Weighted scorer by mode ---

function computeModeScore(
  d: Destination,
  ls: LongStayDestinationData,
  trustScore: number,
  freshnessScore: number,
  costScore: number,
  mode: CompareMode
): number {
  const readiness = norm(getDestinationReadinessScore(d));
  const safety = norm(d.safetyScore);
  const internet = norm(d.internetScore);
  const transport = norm(d.transportScore);
  const cost = costScore;
  const trust = norm(trustScore);
  const freshness = norm(freshnessScore);
  const visa = norm(visaComplexityToScore(ls.visaComplexity));
  const housing = norm(housingPressureToScore(ls.housingPressure));
  const healthcare = norm(healthcareToScore(ls.healthcareReadiness));

  const trustFreshness = (trust + freshness) / 2;

  switch (mode) {
    case 'tourist':
      return (
        readiness * 0.25 +
        safety * 0.25 +
        cost * 0.15 +
        transport * 0.15 +
        visa * 0.10 +
        trustFreshness * 0.10
      ) * 100;

    case 'remote-work':
      return (
        internet * 0.30 +
        cost * 0.20 +
        safety * 0.15 +
        housing * 0.15 +
        trustFreshness * 0.10 +
        healthcare * 0.10
      ) * 100;

    case 'business':
      return (
        transport * 0.25 +
        safety * 0.20 +
        internet * 0.20 +
        readiness * 0.15 +
        cost * 0.10 +
        trustFreshness * 0.10
      ) * 100;

    case 'long-stay':
      return (
        cost * 0.25 +
        visa * 0.20 +
        housing * 0.15 +
        healthcare * 0.15 +
        internet * 0.15 +
        safety * 0.05 +
        trustFreshness * 0.05
      ) * 100;
  }
}

function deriveStrengths(d: Destination, ls: LongStayDestinationData, mode: CompareMode): string[] {
  const strengths: string[] = [];

  if (d.safetyScore >= 90) strengths.push('Excellent safety score');
  else if (d.safetyScore >= 80) strengths.push('Strong safety record');

  if (d.internetScore >= 90) strengths.push('World-class internet infrastructure');
  else if (d.internetScore >= 80) strengths.push('Reliable internet coverage');

  if (d.transportScore >= 90) strengths.push('Outstanding transit network');
  else if (d.transportScore >= 85) strengths.push('Highly efficient transit');

  if (ls.visaComplexity === 'simple') strengths.push('Simple visa / low entry friction');
  if (ls.housingPressure === 'low') strengths.push('Accessible housing market');
  if (ls.healthcareReadiness === 'strong') strengths.push('Strong healthcare access');
  if (ls.internetTier === 'excellent') strengths.push('Excellent remote work infrastructure');

  if (mode === 'tourist' && d.bestFor.length > 0) {
    strengths.push(`Strong for: ${d.bestFor.slice(0, 2).join(', ')}`);
  }
  if (mode === 'long-stay' && ls.maxVisaFreeDays >= 90) {
    strengths.push(`Up to ${ls.maxVisaFreeDays} visa-free days`);
  }

  return strengths.slice(0, 3);
}

function deriveMainCaution(d: Destination, ls: LongStayDestinationData): string {
  if (ls.cautionNotes.length > 0) return ls.cautionNotes[0];
  if (d.safetyScore < 75) return 'Safety score warrants closer review before booking.';
  if (ls.housingPressure === 'high') return 'Housing market is competitive; book accommodation early.';
  if (ls.visaComplexity === 'complex') return 'Visa and stay rules are complex; verify requirements carefully.';
  return d.advisoryNote.length > 120 ? `${d.advisoryNote.slice(0, 120)}…` : d.advisoryNote;
}

// --- Main export ---

// Default fallback for missing long-stay data
const defaultLongStay = (destinationId: string): LongStayDestinationData => ({
  destinationId,
  estimatedMonthlyCostLow: 2000,
  estimatedMonthlyCostMid: 3000,
  estimatedMonthlyCostHigh: 4500,
  internetTier: 'good',
  internetNote: 'Data not available.',
  housingPressure: 'moderate',
  housingNote: 'Data not available.',
  healthcareReadiness: 'adequate',
  healthcareNote: 'Data not available.',
  transportFit: 'good',
  transportNote: 'Data not available.',
  visaComplexity: 'moderate',
  stayRuleSummary: 'Verify requirements with official sources.',
  maxVisaFreeDays: 90,
  longStayRiskLevel: 'moderate',
  bestFor: [],
  cautionNotes: [],
  checklistItems: [],
  currencyVolatilityNote: 'Data not available.',
  costVolatilityNote: 'Data not available.',
});

export function runComparison(
  destinations: Destination[],
  mode: CompareMode
): CompareResult {
  const allCosts = destinations.map((d) => d.monthlyCostEstimate);

  const scores: DestinationCompareScore[] = destinations.map((d) => {
    const ls = getLongStayData(d.id) ?? defaultLongStay(d.id);
    const trust = getDestinationTrustMetadata(d.id);
    const trustScore = trust ? getTrustScore(trust) : 60;
    const freshnessScore = trust ? freshnessToScore(trust.freshnessStatus) : 60;
    const costScore = normCostInverse(d.monthlyCostEstimate, allCosts);

    const overallScore = computeModeScore(d, ls, trustScore, freshnessScore, costScore, mode);

    return {
      destination: d,
      longStay: ls,
      overallScore: Math.round(overallScore),
      readinessScore: getDestinationReadinessScore(d),
      safetyScore: d.safetyScore,
      internetScore: d.internetScore,
      transportScore: d.transportScore,
      costScore: Math.round(costScore * 100),
      trustScore: Math.round(trustScore),
      freshnessScore: Math.round(freshnessScore),
      visaScore: visaComplexityToScore(ls.visaComplexity),
      housingScore: housingPressureToScore(ls.housingPressure),
      healthcareScore: healthcareToScore(ls.healthcareReadiness),
      topStrengths: deriveStrengths(d, ls, mode),
      mainCaution: deriveMainCaution(d, ls),
      costBand: d.budgetBand,
      monthlyCost: d.monthlyCostEstimate,
    };
  });

  // Sort by overall score descending
  const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);

  const bestMatch = sorted[0];
  const bestValue = [...scores].sort((a, b) => a.monthlyCost - b.monthlyCost)[0];
  const bestRemoteWork = [...scores].sort((a, b) => b.internetScore - a.internetScore)[0];
  const lowestFriction = [...scores].sort((a, b) => b.visaScore - a.visaScore)[0];
  const watchCarefully = [...scores].sort((a, b) => a.trustScore - b.trustScore)[0];

  const insights = generateInsights(scores, bestMatch, bestValue, bestRemoteWork, lowestFriction, watchCarefully, mode);

  return { scores: sorted, insights, bestMatch, bestValue, bestRemoteWork, lowestFriction, watchCarefully };
}

function generateInsights(
  scores: DestinationCompareScore[],
  bestMatch: DestinationCompareScore,
  bestValue: DestinationCompareScore,
  bestRemoteWork: DestinationCompareScore,
  lowestFriction: DestinationCompareScore,
  watchCarefully: DestinationCompareScore,
  mode: CompareMode
): CompareInsight[] {
  const insights: CompareInsight[] = [];
  const names = scores.map((s) => s.destination.city);

  // Best overall
  insights.push({
    type: 'winner',
    label: 'Best overall match',
    destinationName: bestMatch.destination.city,
    explanation: `${bestMatch.destination.city} scores highest overall for ${compareModeLabels[mode].toLowerCase()} based on weighted criteria for this mode.`,
  });

  // Value insight
  if (bestValue.destination.id !== bestMatch.destination.id) {
    const savings = bestMatch.monthlyCost - bestValue.monthlyCost;
    insights.push({
      type: 'value',
      label: 'Best value',
      destinationName: bestValue.destination.city,
      explanation: `${bestValue.destination.city} is the most budget-friendly option at ${bestValue.costBand}${savings > 0 ? `, saving roughly $${savings.toLocaleString()}/mo vs ${bestMatch.destination.city}` : ''}.`,
    });
  }

  // Internet / remote work
  if (scores.length > 1) {
    const internetLeader = [...scores].sort((a, b) => b.internetScore - a.internetScore)[0];
    insights.push({
      type: 'remote',
      label: 'Best for remote work',
      destinationName: internetLeader.destination.city,
      explanation: `${internetLeader.destination.city} has the strongest internet score (${internetLeader.internetScore}/100)${internetLeader.longStay.internetTier === 'excellent' ? ' with excellent-tier infrastructure' : ''}.`,
    });
  }

  // Low friction
  const frictionInsight = `${lowestFriction.destination.city} has the lowest entry friction (${lowestFriction.longStay.visaComplexity} visa complexity, up to ${lowestFriction.longStay.maxVisaFreeDays} visa-free days).`;
  insights.push({
    type: 'friction',
    label: 'Lowest planning friction',
    destinationName: lowestFriction.destination.city,
    explanation: frictionInsight,
  });

  // Safety note if meaningful spread
  const safetySorted = [...scores].sort((a, b) => b.safetyScore - a.safetyScore);
  const safetySpread = safetySorted[0].safetyScore - safetySorted[safetySorted.length - 1].safetyScore;
  if (safetySpread >= 10 && names.length > 1) {
    const safetyLeader = safetySorted[0];
    const safetyLaggard = safetySorted[safetySorted.length - 1];
    insights.push({
      type: 'caution',
      label: 'Watch carefully',
      destinationName: watchCarefully.destination.city,
      explanation: `${safetyLeader.destination.city} leads on safety (${safetyLeader.safetyScore}/100). ${safetyLaggard.destination.city} scores lower (${safetyLaggard.safetyScore}/100) — review advisory notes before booking.`,
    });
  } else {
    insights.push({
      type: 'caution',
      label: 'Watch carefully',
      destinationName: watchCarefully.destination.city,
      explanation: `${watchCarefully.destination.city} has the lowest data confidence score. Verify requirements through official sources before finalizing plans.`,
    });
  }

  return insights;
}
