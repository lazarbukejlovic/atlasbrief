import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  isSupabaseConfigured,
  supabase,
  supabaseConfigMessage,
} from '../lib/supabaseClient';
import { PLAN_LIMITS } from '../lib/planLimits';

export type PlanName = 'Free' | 'Plus' | 'Pro' | 'B2B Widget';

interface PlanDetails {
  name: PlanName;
  savedBriefLimit: number | 'Custom';
  refreshType: string;
  features: string[];
}

export interface BillingProfile {
  user_id: string;
  stripe_customer_id: string | null;
  plan: string | null;
  subscription_status: string | null;
}

const PLAN_CATALOG: Record<PlanName, PlanDetails> = {
  Free: {
    name: 'Free',
    savedBriefLimit: PLAN_LIMITS.free,
    refreshType: 'Manual',
    features: ['Basic readiness scores'],
  },
  Plus: {
    name: 'Plus',
    savedBriefLimit: PLAN_LIMITS.plus,
    refreshType: 'Monitored',
    features: ['Change alerts', 'Budget bands', 'Currency and advisory watch'],
  },
  Pro: {
    name: 'Pro',
    savedBriefLimit: PLAN_LIMITS.pro,
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
  billingLoading: boolean;
  authMessage: string | null;
  currentPlan: PlanName;
  planDetails: PlanDetails;
  billingProfile: BillingProfile | null;
  refreshBilling: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUpWithPassword: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const normalizePlanName = (value: string | null | undefined): PlanName => {
  switch (value?.toLowerCase()) {
    case 'plus':
      return 'Plus';
    case 'pro':
      return 'Pro';
    case 'b2b widget':
    case 'b2b_widget':
    case 'b2b-widget':
      return 'B2B Widget';
    case 'free':
    default:
      return 'Free';
  }
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PlanName>('Free');
  const [billingProfile, setBillingProfile] = useState<BillingProfile | null>(null);

  const loadBillingProfile = useCallback(async (userId: string | null) => {
    if (!userId || !isSupabaseConfigured || !supabase) {
      setBillingProfile(null);
      setCurrentPlan('Free');
      setBillingLoading(false);
      return null;
    }

    setBillingLoading(true);

    const { data, error } = await supabase
      .from('user_billing')
      .select('user_id, stripe_customer_id, plan, subscription_status')
      .eq('user_id', userId)
      .maybeSingle<BillingProfile>();

    if (error) {
      setBillingProfile(null);
      setCurrentPlan('Free');
      setBillingLoading(false);
      return null;
    }

    setBillingProfile(data ?? null);
    setCurrentPlan(normalizePlanName(data?.plan));
    setBillingLoading(false);
    return data ?? null;
  }, []);

  const refreshBilling = useCallback(async () => {
    await loadBillingProfile(user?.id ?? null);
  }, [loadBillingProfile, user?.id]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setBillingLoading(false);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }

      await loadBillingProfile(data.session?.user?.id ?? null);

      if (mounted) {
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
      setLoading(true);
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);

      void loadBillingProfile(nextSession?.user?.id ?? null).finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
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
      setBillingProfile(null);
      setCurrentPlan('Free');
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
      billingLoading,
      authMessage: isSupabaseConfigured ? null : supabaseConfigMessage,
      currentPlan,
      planDetails: PLAN_CATALOG[currentPlan],
      billingProfile,
      refreshBilling,
      signInWithPassword,
      signUpWithPassword,
      signOut,
    }),
    [billingLoading, billingProfile, currentPlan, loading, refreshBilling, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
