import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StayFeasibilityReport } from '../lib/stayPlanner';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { getStayPlanLimit, getStayPlanLimitMessage, toBillingPlan } from '../lib/planLimits';
import { useAuth } from './useAuth';

export interface SavedStayPlan {
  id: string;
  user_id: string;
  destination_id: string;
  destination_name: string;
  country: string;
  stay_length_days: number;
  monthly_budget_range: string;
  work_style: string;
  internet_importance: string;
  housing_preference: string;
  risk_tolerance: string;
  feasibility_score: number;
  recommendation: string;
  estimated_monthly_cost: number;
  estimated_total_cost: number;
  report_snapshot: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface UseStayPlansResult {
  stayPlans: SavedStayPlan[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveMessage: string | null;
  limitWarning: string | null;
  stayPlanLimit: number;
  refreshStayPlans: () => Promise<void>;
  saveStayPlan: (report: StayFeasibilityReport) => Promise<void>;
  removeStayPlan: (stayPlanId: string) => Promise<void>;
}

export const useStayPlans = (): UseStayPlansResult => {
  const { isAuthenticated, user, currentPlan } = useAuth();
  const [stayPlans, setStayPlans] = useState<SavedStayPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const billingPlan = useMemo(() => toBillingPlan(currentPlan), [currentPlan]);
  const stayPlanLimit = useMemo(() => getStayPlanLimit(billingPlan), [billingPlan]);

  const refreshStayPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
      setStayPlans([]);
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from('stay_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (queryError) {
      setError('Could not load saved stay plans right now.');
      setStayPlans([]);
      setLoading(false);
      return;
    }

    setStayPlans((data ?? []) as SavedStayPlan[]);
    setLoading(false);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    void refreshStayPlans();
  }, [refreshStayPlans]);

  const saveStayPlan = useCallback(
    async (report: StayFeasibilityReport) => {
      setError(null);
      setSaveMessage(null);
      setLimitWarning(null);

      if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
        setError('Log in to save this stay plan across devices.');
        return;
      }

      setSaving(true);

      const { inputs, destination } = report;

      const { data: existingRow, error: existingError } = await supabase
        .from('stay_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('destination_id', destination.id)
        .eq('stay_length_days', inputs.stayLength)
        .eq('monthly_budget_range', inputs.budgetRange)
        .eq('work_style', inputs.workStyle)
        .eq('internet_importance', inputs.internetImportance)
        .eq('housing_preference', inputs.housingPreference)
        .eq('risk_tolerance', inputs.riskTolerance)
        .maybeSingle<{ id: string }>();

      if (existingError) {
        setSaving(false);
        setError('Could not save stay plan. Please try again.');
        return;
      }

      if (existingRow?.id) {
        setSaving(false);
        setSaveMessage('This stay plan is already saved.');
        return;
      }

      const { count, error: countError } = await supabase
        .from('stay_plans')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        setSaving(false);
        setError('Could not save stay plan. Please try again.');
        return;
      }

      if ((count ?? stayPlans.length) >= stayPlanLimit) {
        setSaving(false);
        setLimitWarning(getStayPlanLimitMessage(billingPlan));
        return;
      }

      const reportSnapshot = {
        generated_at: new Date().toISOString(),
        destination: {
          id: destination.id,
          city: destination.city,
          country: destination.country,
        },
        inputs,
        summary: {
          overall_score: report.overallScore,
          recommendation: report.finalRecommendation,
          estimated_monthly_cost: report.monthlyEstimate,
          estimated_total_cost: report.totalEstimate,
        },
        section_scores: {
          affordability: report.affordabilityScore,
          internet_fit: report.internetFitScore,
          housing_fit: report.housingFitScore,
          transport_fit: report.transportFitScore,
          safety_fit: report.safetyFitScore,
          healthcare_fit: report.healthcareFitScore,
        },
        long_stay_context: {
          visa_complexity: report.longStay.visaComplexity,
          max_visa_free_days: report.longStay.maxVisaFreeDays,
          stay_rule_summary: report.longStay.stayRuleSummary,
          risk_level: report.longStay.longStayRiskLevel,
          caution_notes: report.longStay.cautionNotes,
          checklist_items: report.longStay.checklistItems,
        },
      };

      const payload = {
        user_id: user.id,
        destination_id: destination.id,
        destination_name: destination.city,
        country: destination.country,
        stay_length_days: inputs.stayLength,
        monthly_budget_range: inputs.budgetRange,
        work_style: inputs.workStyle,
        internet_importance: inputs.internetImportance,
        housing_preference: inputs.housingPreference,
        risk_tolerance: inputs.riskTolerance,
        feasibility_score: report.overallScore,
        recommendation: report.finalRecommendation,
        estimated_monthly_cost: report.monthlyEstimate,
        estimated_total_cost: report.totalEstimate,
        report_snapshot: reportSnapshot,
      };

      const { data, error: insertError } = await supabase
        .from('stay_plans')
        .insert(payload)
        .select('*')
        .single();

      if (insertError) {
        setSaving(false);
        if ((insertError as { code?: string }).code === '23505') {
          setSaveMessage('This stay plan is already saved.');
          return;
        }
        setError('Could not save stay plan. Please try again.');
        return;
      }

      setStayPlans((current) => [data as SavedStayPlan, ...current]);
      setSaveMessage('Stay plan saved.');
      setSaving(false);
    },
    [billingPlan, isAuthenticated, stayPlanLimit, stayPlans.length, user?.id]
  );

  const removeStayPlan = useCallback(
    async (stayPlanId: string) => {
      setError(null);
      setSaveMessage(null);
      setLimitWarning(null);

      if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
        return;
      }

      const { error: deleteError } = await supabase
        .from('stay_plans')
        .delete()
        .eq('user_id', user.id)
        .eq('id', stayPlanId);

      if (deleteError) {
        setError('Could not remove this stay plan right now.');
        return;
      }

      setStayPlans((current) => current.filter((plan) => plan.id !== stayPlanId));
    },
    [isAuthenticated, user?.id]
  );

  return {
    stayPlans,
    loading,
    saving,
    error,
    saveMessage,
    limitWarning,
    stayPlanLimit,
    refreshStayPlans,
    saveStayPlan,
    removeStayPlan,
  };
};
