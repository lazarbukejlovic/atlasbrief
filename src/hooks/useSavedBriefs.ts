import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Destination } from '../data/destinations';
import { getDestinationReadinessScore } from '../data/destinations';
import { useAuth } from './useAuth';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { getSavedBriefLimit, getSavedLimitMessage, toBillingPlan } from '../lib/planLimits';

const LOCAL_SAVED_KEY = 'atlasbrief-saved-destinations:guest';

export interface SavedBrief {
  id?: string;
  user_id?: string;
  destination_id: string;
  city: string;
  country: string;
  readiness_status: string;
  readiness_score: number;
  cost_band: string;
  safety_score: number;
  last_checked: string;
  what_changed: string;
  created_at?: string;
  updated_at?: string;
}

interface UseSavedBriefsResult {
  savedBriefs: SavedBrief[];
  loading: boolean;
  error: string | null;
  limitWarning: string | null;
  savedLimit: number | 'Custom';
  getSavedBriefs: () => Promise<void>;
  saveBrief: (destination: Destination) => Promise<void>;
  removeBrief: (destinationId: string) => Promise<void>;
  isSaved: (destinationId: string) => boolean;
  toggleSaved: (destination: Destination) => Promise<void>;
}

const toLocalBrief = (destination: Destination): SavedBrief => ({
  destination_id: destination.id,
  city: destination.city,
  country: destination.country,
  readiness_status: destination.readinessStatus,
  readiness_score: getDestinationReadinessScore(destination),
  cost_band: destination.budgetBand,
  safety_score: destination.safetyScore,
  last_checked: destination.lastChecked,
  what_changed: destination.whatChanged[0] ?? 'No recent changes reported.',
});

export const useSavedBriefs = (
  destinations: Destination[]
): UseSavedBriefsResult => {
  const { isAuthenticated, user, currentPlan, planDetails } = useAuth();
  const [savedBriefs, setSavedBriefs] = useState<SavedBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const destinationMap = useMemo(() => {
    const map = new Map<string, Destination>();
    destinations.forEach((destination) => map.set(destination.id, destination));
    return map;
  }, [destinations]);

  const currentBillingPlan = useMemo(() => toBillingPlan(currentPlan), [currentPlan]);

  const hasCustomLimit = planDetails.savedBriefLimit === 'Custom';

  const enforcedSavedLimit = useMemo(() => {
    if (hasCustomLimit) {
      return Number.MAX_SAFE_INTEGER;
    }

    if (typeof planDetails.savedBriefLimit === 'number') {
      return planDetails.savedBriefLimit;
    }

    return getSavedBriefLimit(currentBillingPlan);
  }, [currentBillingPlan, hasCustomLimit, planDetails.savedBriefLimit]);

  const savedLimitDisplay = useMemo<number | 'Custom'>(() => {
    if (hasCustomLimit) {
      return 'Custom';
    }

    return enforcedSavedLimit;
  }, [enforcedSavedLimit, hasCustomLimit]);

  const getSavedBriefs = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isAuthenticated && user?.id && isSupabaseConfigured && supabase) {
      const { data, error: queryError } = await supabase
        .from('saved_briefs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        setError('Unable to load saved briefs from database right now. Showing local data when available.');
        const localRaw = window.localStorage.getItem(LOCAL_SAVED_KEY);
        if (localRaw) {
          try {
            const localIds = JSON.parse(localRaw) as string[];
            const localBriefs = localIds
              .map((id) => destinationMap.get(id))
              .filter((destination): destination is Destination => Boolean(destination))
              .map((destination) => toLocalBrief(destination));
            setSavedBriefs(localBriefs);
          } catch {
            setSavedBriefs([]);
          }
        } else {
          setSavedBriefs([]);
        }

        setLoading(false);
        return;
      }

      setSavedBriefs((data ?? []) as SavedBrief[]);
      setLoading(false);
      return;
    }

    const raw = window.localStorage.getItem(LOCAL_SAVED_KEY);
    if (!raw) {
      setSavedBriefs([]);
      setLoading(false);
      return;
    }

    try {
      const ids = JSON.parse(raw) as string[];
      const localBriefs = ids
        .map((id) => destinationMap.get(id))
        .filter((destination): destination is Destination => Boolean(destination))
        .map((destination) => toLocalBrief(destination));
      setSavedBriefs(localBriefs);
    } catch {
      window.localStorage.removeItem(LOCAL_SAVED_KEY);
      setSavedBriefs([]);
    }

    setLoading(false);
  }, [destinationMap, isAuthenticated, user?.id]);

  useEffect(() => {
    void getSavedBriefs();
  }, [getSavedBriefs]);

  const saveBrief = useCallback(
    async (destination: Destination) => {
      setError(null);
      setLimitWarning(null);

      const alreadySaved = savedBriefs.some(
        (brief) => brief.destination_id === destination.id
      );

      if (alreadySaved) {
        return;
      }

      if (isAuthenticated && user?.id && isSupabaseConfigured && supabase) {
        const { data: existingRow, error: existingError } = await supabase
          .from('saved_briefs')
          .select('id')
          .eq('user_id', user.id)
          .eq('destination_id', destination.id)
          .maybeSingle<{ id: string }>();

        if (existingError) {
          setError('Could not save this brief right now. Please try again.');
          return;
        }

        if (existingRow?.id) {
          return;
        }

        const { count, error: countError } = await supabase
          .from('saved_briefs')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (countError) {
          setError('Could not save this brief right now. Please try again.');
          return;
        }

        const currentCount = count ?? savedBriefs.length;
        if (currentCount >= enforcedSavedLimit) {
          setLimitWarning(getSavedLimitMessage(currentBillingPlan));
          return;
        }

        const payload = {
          user_id: user.id,
          destination_id: destination.id,
          city: destination.city,
          country: destination.country,
          readiness_status: destination.readinessStatus,
          readiness_score: getDestinationReadinessScore(destination),
          cost_band: destination.budgetBand,
          safety_score: destination.safetyScore,
          last_checked: destination.lastChecked,
          what_changed: destination.whatChanged[0] ?? 'No recent changes reported.',
        };

        const { data, error: insertError } = await supabase
          .from('saved_briefs')
          .insert(payload)
          .select('*')
          .single();

        if (insertError) {
          if ((insertError as { code?: string }).code === '23505') {
            return;
          }
          setError('Could not save this brief right now. Please try again.');
          return;
        }

        setSavedBriefs((current) => [data as SavedBrief, ...current]);
        return;
      }

      if (savedBriefs.length >= getSavedBriefLimit('free')) {
        setLimitWarning(getSavedLimitMessage('free'));
        return;
      }

      const currentIds = savedBriefs.map((brief) => brief.destination_id);
      const nextIds = [...currentIds, destination.id];
      window.localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(nextIds));
      setSavedBriefs((current) => [toLocalBrief(destination), ...current]);
    },
    [
      currentBillingPlan,
      enforcedSavedLimit,
      isAuthenticated,
      savedBriefs,
      user?.id,
    ]
  );

  const removeBrief = useCallback(
    async (destinationId: string) => {
      setError(null);
      setLimitWarning(null);

      if (isAuthenticated && user?.id && isSupabaseConfigured && supabase) {
        const { error: deleteError } = await supabase
          .from('saved_briefs')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destinationId);

        if (deleteError) {
          setError('Could not remove this brief right now. Please try again.');
          return;
        }

        setSavedBriefs((current) =>
          current.filter((brief) => brief.destination_id !== destinationId)
        );
        return;
      }

      const next = savedBriefs
        .filter((brief) => brief.destination_id !== destinationId)
        .map((brief) => brief.destination_id);
      window.localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(next));
      setSavedBriefs((current) =>
        current.filter((brief) => brief.destination_id !== destinationId)
      );
    },
    [isAuthenticated, savedBriefs, user?.id]
  );

  const isSaved = useCallback(
    (destinationId: string) =>
      savedBriefs.some((brief) => brief.destination_id === destinationId),
    [savedBriefs]
  );

  const toggleSaved = useCallback(
    async (destination: Destination) => {
      if (isSaved(destination.id)) {
        await removeBrief(destination.id);
        return;
      }

      await saveBrief(destination);
    },
    [isSaved, removeBrief, saveBrief]
  );

  return {
    savedBriefs,
    loading,
    error,
    limitWarning,
    savedLimit: savedLimitDisplay,
    getSavedBriefs,
    saveBrief,
    removeBrief,
    isSaved,
    toggleSaved,
  };
};
