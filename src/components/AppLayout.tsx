import { useMemo } from 'react';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import type { Destination } from '../data/destinations';
import type { SavedBrief } from '../hooks/useSavedBriefs';
import type { DestinationWatchlistRow } from '../data/watchlistSignals';
import { useDestinationWatchlist } from '../hooks/useDestinationWatchlist';
import { useSavedBriefs } from '../hooks/useSavedBriefs';
import Footer from './Footer';
import Navbar from './Navbar';

export interface AtlasBriefContextValue {
  destinations: Destination[];
  savedBriefs: SavedBrief[];
  savedIds: string[];
  toggleSaved: (destination: Destination) => Promise<void>;
  isSaved: (id: string) => boolean;
  watchlist: DestinationWatchlistRow[];
  watchlistIds: string[];
  toggleWatchlist: (destination: Destination) => Promise<void>;
  removeFromWatchlist: (destinationId: string) => Promise<void>;
  isWatched: (id: string) => boolean;
  loadingWatchlist: boolean;
  watchlistError: string | null;
  watchlistLimit: number;
  watchlistLimitMessage: string | null;
  loadingSavedBriefs: boolean;
  savedBriefsError: string | null;
  savedLimit: number | 'Custom';
  limitMessage: string | null;
}

interface AppLayoutProps {
  destinations: Destination[];
}

const AppLayout = ({ destinations }: AppLayoutProps) => {
  const {
    savedBriefs,
    loading,
    error,
    limitWarning,
    savedLimit,
    toggleSaved,
    isSaved,
  } = useSavedBriefs(destinations);
  const {
    watchlist,
    watchlistIds,
    loading: loadingWatchlist,
    error: watchlistError,
    limitWarning: watchlistLimitMessage,
    watchlistLimit,
    toggleWatchlist,
    removeFromWatchlist,
    isWatched,
  } = useDestinationWatchlist();

  const savedIds = useMemo(
    () => savedBriefs.map((brief) => brief.destination_id),
    [savedBriefs]
  );

  const contextValue = useMemo<AtlasBriefContextValue>(
    () => ({
      destinations,
      savedBriefs,
      savedIds,
      toggleSaved,
      isSaved,
      watchlist,
      watchlistIds,
      toggleWatchlist,
      removeFromWatchlist,
      isWatched,
      loadingWatchlist,
      watchlistError,
      watchlistLimit,
      watchlistLimitMessage,
      loadingSavedBriefs: loading,
      savedBriefsError: error,
      savedLimit,
      limitMessage: limitWarning,
    }),
    [
      destinations,
      savedBriefs,
      savedIds,
      toggleSaved,
      isSaved,
      watchlist,
      watchlistIds,
      toggleWatchlist,
      removeFromWatchlist,
      isWatched,
      loadingWatchlist,
      watchlistError,
      watchlistLimit,
      watchlistLimitMessage,
      loading,
      error,
      savedLimit,
      limitWarning,
    ]
  );

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.22),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(212,168,83,0.18),_transparent_30%),linear-gradient(180deg,_#fffef9_0%,_#fafaf7_70%)]" />
      <Navbar savedCount={savedIds.length} />
      <main className="mx-auto min-h-[calc(100vh-180px)] max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        ) : null}
        {limitWarning ? (
          <div className="mb-6 overflow-hidden rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-rose-50 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="text-sm font-medium text-amber-950">{limitWarning}</p>
              <Link
                to="/pricing"
                className="inline-flex items-center rounded-2xl bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light"
              >
                View plans
              </Link>
            </div>
          </div>
        ) : null}
        <Outlet context={contextValue} />
      </main>
      <Footer />
    </div>
  );
};

export const useAtlasBrief = () => useOutletContext<AtlasBriefContextValue>();

export default AppLayout;