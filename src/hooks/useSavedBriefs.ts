import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Destination } from '../data/destinations';
import { getDestinationReadinessScore } from '../data/destinations';
import { useAuth } from './useAuth';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

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

  const getSavedBriefs = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isAuthenticated && user?.id && isSupabaseConfigured && supabase) {
      const { data, error: queryError } = await supabase
        .from('saved_briefs')
        .select('*')
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

      if (
        isAuthenticated &&
        currentPlan === 'Free' &&
        typeof planDetails.savedBriefLimit === 'number' &&
        savedBriefs.length >= planDetails.savedBriefLimit
      ) {
        setLimitWarning('Free plan includes 1 saved trip. Upgrade to Plus for 5 saved trips.');
        return;
      }

      if (isAuthenticated && user?.id && isSupabaseConfigured && supabase) {
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
          setError('Could not save this brief right now. Please try again.');
          return;
        }

        setSavedBriefs((current) => [data as SavedBrief, ...current]);
        return;
      }

      const currentIds = savedBriefs.map((brief) => brief.destination_id);
      const nextIds = [...currentIds, destination.id];
      window.localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(nextIds));
      setSavedBriefs((current) => [toLocalBrief(destination), ...current]);
    },
    [
      currentPlan,
      isAuthenticated,
      planDetails.savedBriefLimit,
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
    savedLimit: planDetails.savedBriefLimit,
    getSavedBriefs,
    saveBrief,
    removeBrief,
    isSaved,
    toggleSaved,
  };
};
