import { useEffect, useMemo, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import type { Destination } from '../data/destinations';
import Footer from './Footer';
import Navbar from './Navbar';

const SAVED_KEY = 'atlasbrief-saved-destinations';

export interface AtlasBriefContextValue {
  destinations: Destination[];
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

interface AppLayoutProps {
  destinations: Destination[];
}

const AppLayout = ({ destinations }: AppLayoutProps) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(SAVED_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as string[];
      setSavedIds(parsed);
    } catch {
      window.localStorage.removeItem(SAVED_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  };

  const contextValue = useMemo<AtlasBriefContextValue>(
    () => ({
      destinations,
      savedIds,
      toggleSaved,
      isSaved: (id: string) => savedIds.includes(id),
    }),
    [destinations, savedIds]
  );

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.22),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(212,168,83,0.18),_transparent_30%),linear-gradient(180deg,_#fffef9_0%,_#fafaf7_70%)]" />
      <Navbar savedCount={savedIds.length} />
      <main className="mx-auto min-h-[calc(100vh-180px)] max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Outlet context={contextValue} />
      </main>
      <Footer />
    </div>
  );
};

export const useAtlasBrief = () => useOutletContext<AtlasBriefContextValue>();

export default AppLayout;