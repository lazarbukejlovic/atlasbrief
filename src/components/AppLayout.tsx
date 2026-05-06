import { useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Destination } from '../data/destinations';
import Footer from './Footer';
import Navbar from './Navbar';

const SAVED_KEY_PREFIX = 'atlasbrief-saved-destinations';

export interface AtlasBriefContextValue {
  destinations: Destination[];
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  savedLimit: number | 'Custom';
  limitReached: boolean;
  limitMessage: string | null;
}

interface AppLayoutProps {
  destinations: Destination[];
}

const AppLayout = ({ destinations }: AppLayoutProps) => {
  const { user, isAuthenticated, currentPlan, planDetails } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [limitReached, setLimitReached] = useState(false);

  const savedKey = useMemo(
    () => `${SAVED_KEY_PREFIX}:${user?.id ?? 'guest'}`,
    [user?.id]
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(savedKey);
    if (!stored) {
      setSavedIds([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as string[];
      setSavedIds(parsed);
    } catch {
      window.localStorage.removeItem(savedKey);
      setSavedIds([]);
    }
  }, [savedKey]);

  useEffect(() => {
    window.localStorage.setItem(savedKey, JSON.stringify(savedIds));
  }, [savedIds, savedKey]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      if (current.includes(id)) {
        setLimitReached(false);
        return current.filter((savedId) => savedId !== id);
      }

      if (
        isAuthenticated &&
        currentPlan === 'Free' &&
        typeof planDetails.savedBriefLimit === 'number' &&
        current.length >= planDetails.savedBriefLimit
      ) {
        setLimitReached(true);
        return current;
      }

      setLimitReached(false);
      return [...current, id];
    });
  };

  const limitMessage =
    isAuthenticated && currentPlan === 'Free'
      ? 'Free plan includes 1 saved trip. Upgrade when you want a larger persistent watchlist.'
      : null;

  const contextValue = useMemo<AtlasBriefContextValue>(
    () => ({
      destinations,
      savedIds,
      toggleSaved,
      isSaved: (id: string) => savedIds.includes(id),
      savedLimit: planDetails.savedBriefLimit,
      limitReached,
      limitMessage,
    }),
    [destinations, savedIds, planDetails.savedBriefLimit, limitReached, limitMessage]
  );

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.22),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(212,168,83,0.18),_transparent_30%),linear-gradient(180deg,_#fffef9_0%,_#fafaf7_70%)]" />
      <Navbar savedCount={savedIds.length} />
      <main className="mx-auto min-h-[calc(100vh-180px)] max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {limitReached && limitMessage ? (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {limitMessage}
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