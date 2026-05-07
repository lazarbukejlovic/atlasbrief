import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Destination } from '../data/destinations';
import {
  createWatchlistSignalRecord,
  type DestinationWatchlistRow,
} from '../data/watchlistSignals';
import { useAuth } from './useAuth';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import {
  getWatchlistLimit,
  getWatchlistLimitMessage,
  toBillingPlan,
} from '../lib/planLimits';

interface UseDestinationWatchlistResult {
  watchlist: DestinationWatchlistRow[];
  watchlistIds: string[];
  loading: boolean;
  error: string | null;
  limitWarning: string | null;
  watchlistLimit: number;
  isWatched: (destinationId: string) => boolean;
  refreshWatchlist: () => Promise<void>;
  addToWatchlist: (destination: Destination) => Promise<void>;
  removeFromWatchlist: (destinationId: string) => Promise<void>;
  toggleWatchlist: (destination: Destination) => Promise<void>;
}

export const useDestinationWatchlist = (): UseDestinationWatchlistResult => {
  const { isAuthenticated, user, currentPlan } = useAuth();
  const [watchlist, setWatchlist] = useState<DestinationWatchlistRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  const billingPlan = useMemo(() => toBillingPlan(currentPlan), [currentPlan]);
  const watchlistLimit = useMemo(() => getWatchlistLimit(billingPlan), [billingPlan]);

  const refreshWatchlist = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from('destination_watchlist')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (queryError) {
      setError('Unable to load your destination watchlist right now.');
      setWatchlist([]);
      setLoading(false);
      return;
    }

    setWatchlist((data ?? []) as DestinationWatchlistRow[]);
    setLoading(false);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    void refreshWatchlist();
  }, [refreshWatchlist]);

  const watchlistIds = useMemo(
    () => watchlist.map((item) => item.destination_id),
    [watchlist]
  );

  const isWatched = useCallback(
    (destinationId: string) => watchlist.some((item) => item.destination_id === destinationId),
    [watchlist]
  );

  const addToWatchlist = useCallback(
    async (destination: Destination) => {
      setError(null);
      setLimitWarning(null);

      if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
        setLimitWarning('Sign in to track destinations in your watchlist.');
        return;
      }

      if (isWatched(destination.id)) {
        return;
      }

      const { data: existingRow, error: existingError } = await supabase
        .from('destination_watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('destination_id', destination.id)
        .maybeSingle<{ id: string }>();

      if (existingError) {
        setError('Could not update your watchlist right now. Please try again.');
        return;
      }

      if (existingRow?.id) {
        return;
      }

      const { count, error: countError } = await supabase
        .from('destination_watchlist')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        setError('Could not update your watchlist right now. Please try again.');
        return;
      }

      if ((count ?? watchlist.length) >= watchlistLimit) {
        setLimitWarning(getWatchlistLimitMessage(billingPlan));
        return;
      }

      const payload = {
        user_id: user.id,
        ...createWatchlistSignalRecord(destination),
      };

      const { data, error: insertError } = await supabase
        .from('destination_watchlist')
        .insert(payload)
        .select('*')
        .single();

      if (insertError) {
        if ((insertError as { code?: string }).code === '23505') {
          return;
        }

        setError('Could not update your watchlist right now. Please try again.');
        return;
      }

      setWatchlist((current) => [data as DestinationWatchlistRow, ...current]);
    },
    [billingPlan, isAuthenticated, isWatched, user?.id, watchlist.length, watchlistLimit]
  );

  const removeFromWatchlist = useCallback(
    async (destinationId: string) => {
      setError(null);
      setLimitWarning(null);

      if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
        return;
      }

      const { error: deleteError } = await supabase
        .from('destination_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('destination_id', destinationId);

      if (deleteError) {
        setError('Could not remove this destination from your watchlist right now.');
        return;
      }

      setWatchlist((current) => current.filter((item) => item.destination_id !== destinationId));
    },
    [isAuthenticated, user?.id]
  );

  const toggleWatchlist = useCallback(
    async (destination: Destination) => {
      if (isWatched(destination.id)) {
        await removeFromWatchlist(destination.id);
        return;
      }

      await addToWatchlist(destination);
    },
    [addToWatchlist, isWatched, removeFromWatchlist]
  );

  return {
    watchlist,
    watchlistIds,
    loading,
    error,
    limitWarning,
    watchlistLimit,
    isWatched,
    refreshWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
};