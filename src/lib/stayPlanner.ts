import type { LongStayDestinationData } from '../data/longStayData';
import type { Destination } from '../data/destinations';

export type WorkStyle = 'remote' | 'business' | 'slow-travel' | 'relocation';
export type InternetImportance = 'standard' | 'high' | 'critical';
export type HousingPreference = 'budget' | 'balanced' | 'premium';
export type RiskTolerance = 'low' | 'medium' | 'flexible';
export type StayLength = 30 | 60 | 90;
export type BudgetRange = 'under-2k' | '2k-3k' | '3k-4k' | '4k-5k' | '5k-plus';

export interface StayPlannerInputs {
  destinationId: string;
  stayLength: StayLength;
  budgetRange: BudgetRange;
  workStyle: WorkStyle;
  internetImportance: InternetImportance;
  housingPreference: HousingPreference;
  riskTolerance: RiskTolerance;
}

export type FinalRecommendation =
  | 'strong-fit'
  | 'good-fit-with-planning'
  | 'possible-watch-carefully'
  | 'not-recommended';

export interface StayFeasibilityReport {
  overallScore: number; // 0–100
  monthlyEstimate: number;
  totalEstimate: number;
  affordabilityScore: number; // 0–100
  internetFitScore: number; // 0–100
  housingFitScore: number; // 0–100
  transportFitScore: number; // 0–100
  safetyFitScore: number; // 0–100
  healthcareFitScore: number; // 0–100
  finalRecommendation: FinalRecommendation;
  destination: Destination;
  longStay: LongStayDestinationData;
  inputs: StayPlannerInputs;
}

const budgetMidpoints: Record<BudgetRange, number> = {
  'under-2k': 1800,
  '2k-3k': 2500,
  '3k-4k': 3500,
  '4k-5k': 4500,
  '5k-plus': 6500,
};

const internetTierScore: Record<string, number> = {
  excellent: 100,
  good: 80,
  adequate: 60,
  variable: 40,
};

const transportFitScore: Record<string, number> = {
  excellent: 100,
  good: 80,
  adequate: 60,
  'car-needed': 45,
};

const housingPressureScore: Record<string, number> = {
  low: 90,
  moderate: 65,
  high: 35,
};

const healthcareScore: Record<string, number> = {
  strong: 100,
  adequate: 65,
  limited: 35,
};

const riskLevelScore: Record<string, number> = {
  low: 95,
  moderate: 68,
  elevated: 42,
};

export function computeFeasibilityReport(
  destination: Destination,
  longStay: LongStayDestinationData,
  inputs: StayPlannerInputs
): StayFeasibilityReport {
  const budgetMid = budgetMidpoints[inputs.budgetRange];

  // Select cost based on housing preference
  let monthlyEstimate = longStay.estimatedMonthlyCostMid;
  if (inputs.housingPreference === 'budget') monthlyEstimate = longStay.estimatedMonthlyCostLow;
  if (inputs.housingPreference === 'premium') monthlyEstimate = longStay.estimatedMonthlyCostHigh;

  const totalEstimate = monthlyEstimate * (inputs.stayLength / 30);

  // Affordability: compare budget to selected monthly cost
  const affordabilityRatio = budgetMid / monthlyEstimate;
  let affordabilityScore: number;
  if (affordabilityRatio >= 1.3) affordabilityScore = 95;
  else if (affordabilityRatio >= 1.1) affordabilityScore = 82;
  else if (affordabilityRatio >= 1.0) affordabilityScore = 68;
  else if (affordabilityRatio >= 0.85) affordabilityScore = 48;
  else affordabilityScore = 28;

  // Internet fit based on importance vs tier
  const baseTierScore = internetTierScore[longStay.internetTier] ?? 60;
  let internetFitScore = baseTierScore;
  if (inputs.internetImportance === 'critical' && baseTierScore < 80) internetFitScore = Math.max(baseTierScore - 20, 20);
  if (inputs.internetImportance === 'high' && baseTierScore < 60) internetFitScore = Math.max(baseTierScore - 10, 30);
  if (inputs.internetImportance === 'standard') internetFitScore = Math.min(100, baseTierScore + 10);

  // Housing fit based on preference vs market pressure
  const baseHousingScore = housingPressureScore[longStay.housingPressure] ?? 65;
  let housingFitScore = baseHousingScore;
  if (inputs.housingPreference === 'budget' && longStay.housingPressure === 'high') housingFitScore = Math.max(baseHousingScore - 20, 20);
  if (inputs.housingPreference === 'premium') housingFitScore = Math.min(100, baseHousingScore + 15);

  // Transport fit
  const transportScore = transportFitScore[longStay.transportFit] ?? 60;
  let transportFit = transportScore;
  if (inputs.workStyle === 'business' && transportScore < 70) transportFit = Math.max(transportScore - 5, 30);

  // Safety fit based on destination safety + risk tolerance
  const baseSafetyFit = riskLevelScore[longStay.longStayRiskLevel] ?? 68;
  let safetyFitScore = baseSafetyFit;
  if (inputs.riskTolerance === 'low' && longStay.longStayRiskLevel !== 'low') safetyFitScore = Math.max(baseSafetyFit - 20, 20);
  if (inputs.riskTolerance === 'flexible') safetyFitScore = Math.min(100, baseSafetyFit + 10);

  // Healthcare fit
  const healthFit = healthcareScore[longStay.healthcareReadiness] ?? 65;
  let healthcareFitScore = healthFit;
  if (inputs.riskTolerance === 'low' && healthFit < 70) healthcareFitScore = Math.max(healthFit - 15, 25);

  // Work-style modifier for internet
  if ((inputs.workStyle === 'remote' || inputs.workStyle === 'business') && inputs.internetImportance === 'critical') {
    if (longStay.internetTier === 'variable') internetFitScore = 25;
  }

  // Overall score: weighted average
  const overallScore = Math.round(
    affordabilityScore * 0.22 +
    internetFitScore * 0.18 +
    housingFitScore * 0.15 +
    safetyFitScore * 0.20 +
    healthcareFitScore * 0.13 +
    transportFit * 0.12
  );

  // Final recommendation
  let finalRecommendation: FinalRecommendation;
  if (overallScore >= 78) finalRecommendation = 'strong-fit';
  else if (overallScore >= 62) finalRecommendation = 'good-fit-with-planning';
  else if (overallScore >= 46) finalRecommendation = 'possible-watch-carefully';
  else finalRecommendation = 'not-recommended';

  // Downgrade if risk tolerance is low and risk level is elevated
  if (inputs.riskTolerance === 'low' && longStay.longStayRiskLevel === 'elevated') {
    if (finalRecommendation === 'good-fit-with-planning') finalRecommendation = 'possible-watch-carefully';
    if (finalRecommendation === 'strong-fit') finalRecommendation = 'good-fit-with-planning';
  }

  // Downgrade if visa-free days are shorter than stay length
  if (longStay.maxVisaFreeDays < inputs.stayLength && longStay.visaComplexity !== 'simple') {
    if (finalRecommendation === 'strong-fit') finalRecommendation = 'good-fit-with-planning';
  }

  return {
    overallScore,
    monthlyEstimate,
    totalEstimate,
    affordabilityScore,
    internetFitScore,
    housingFitScore: housingFitScore,
    transportFitScore: transportFit,
    safetyFitScore,
    healthcareFitScore,
    finalRecommendation,
    destination,
    longStay,
    inputs,
  };
}

export const budgetRangeLabels: Record<BudgetRange, string> = {
  'under-2k': 'Under $2,000/mo',
  '2k-3k': '$2,000–$3,000/mo',
  '3k-4k': '$3,000–$4,000/mo',
  '4k-5k': '$4,000–$5,000/mo',
  '5k-plus': '$5,000+/mo',
};

export const workStyleLabels: Record<WorkStyle, string> = {
  remote: 'Remote work',
  business: 'Business travel',
  'slow-travel': 'Slow travel',
  relocation: 'Relocation research',
};

export const internetImportanceLabels: Record<InternetImportance, string> = {
  standard: 'Standard (browsing, email)',
  high: 'High (video calls, cloud tools)',
  critical: 'Critical (constant uptime required)',
};

export const housingPreferenceLabels: Record<HousingPreference, string> = {
  budget: 'Budget (lean options)',
  balanced: 'Balanced (mid-range)',
  premium: 'Premium (comfort-first)',
};

export const riskToleranceLabels: Record<RiskTolerance, string> = {
  low: 'Low (prefer stable, predictable destinations)',
  medium: 'Medium (manageable risk with planning)',
  flexible: 'Flexible (comfortable with tradeoffs)',
};

export const recommendationMeta: Record<
  FinalRecommendation,
  { label: string; color: string; bg: string; border: string; description: string }
> = {
  'strong-fit': {
    label: 'Strong fit',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'This destination aligns well with your preferences, budget, and stay requirements. Standard planning applies.',
  },
  'good-fit-with-planning': {
    label: 'Good fit with planning',
    color: 'text-sky-800',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    description: 'This destination is viable but has specific areas requiring attention before you commit. Review the caution notes carefully.',
  },
  'possible-watch-carefully': {
    label: 'Possible — watch carefully',
    color: 'text-amber-900',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'This stay is achievable but has friction points that may significantly affect your experience. Thorough preparation is required.',
  },
  'not-recommended': {
    label: 'Not recommended for this stay',
    color: 'text-red-900',
    bg: 'bg-red-50',
    border: 'border-red-200',
    description: 'Given your preferences and requirements, this destination presents too many gaps for a comfortable long stay. Consider adjusting your inputs or choosing a different destination.',
  },
};
