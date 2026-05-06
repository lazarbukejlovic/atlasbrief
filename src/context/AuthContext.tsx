import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  isSupabaseConfigured,
  supabase,
  supabaseConfigMessage,
} from '../lib/supabaseClient';

export type PlanName = 'Free' | 'Plus' | 'Pro' | 'B2B Widget';

interface PlanDetails {
  name: PlanName;
  savedBriefLimit: number | 'Custom';
  refreshType: string;
  features: string[];
}

const PLAN_CATALOG: Record<PlanName, PlanDetails> = {
  Free: {
    name: 'Free',
    savedBriefLimit: 1,
    refreshType: 'Manual',
    features: ['Basic readiness scores'],
  },
  Plus: {
    name: 'Plus',
    savedBriefLimit: 5,
    refreshType: 'Monitored',
    features: ['Change alerts', 'Budget bands', 'Currency and advisory watch'],
  },
  Pro: {
    name: 'Pro',
    savedBriefLimit: 20,
    refreshType: 'Monitored',
    features: [
      'Family sharing',
      'Compare destinations',
      'Early 30-90 day stay planner',
    ],
  },
  'B2B Widget': {
    name: 'B2B Widget',
    savedBriefLimit: 'Custom',
    refreshType: 'Custom pilot',
    features: ['White-label readiness component'],
  },
};

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
  loading: boolean;
  authMessage: string | null;
  currentPlan: PlanName;
  planDetails: PlanDetails;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUpWithPassword: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const PLAN_STORAGE_PREFIX = 'atlasbrief-user-plan';

const getStoredPlan = (userId: string | null): PlanName => {
  if (!userId) {
    return 'Free';
  }

  const raw = window.localStorage.getItem(`${PLAN_STORAGE_PREFIX}:${userId}`);
  if (!raw) {
    return 'Free';
  }

  if (raw === 'Free' || raw === 'Plus' || raw === 'Pro' || raw === 'B2B Widget') {
    return raw;
  }

  return 'Free';
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PlanName>('Free');

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setCurrentPlan(getStoredPlan(data.session?.user?.id ?? null));
        setLoading(false);
      }
    };

    void initialize();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setCurrentPlan(getStoredPlan(nextSession?.user?.id ?? null));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return supabaseConfigMessage;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUpWithPassword = async (email: string, password: string) => {
    if (!supabase || !isSupabaseConfigured) {
      return supabaseConfigMessage;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  };

  const signOut = async () => {
    if (!supabase || !isSupabaseConfigured) {
      setSession(null);
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user),
      isConfigured: isSupabaseConfigured,
      loading,
      authMessage: isSupabaseConfigured ? null : supabaseConfigMessage,
      currentPlan,
      planDetails: PLAN_CATALOG[currentPlan],
      signInWithPassword,
      signUpWithPassword,
      signOut,
    }),
    [currentPlan, loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
