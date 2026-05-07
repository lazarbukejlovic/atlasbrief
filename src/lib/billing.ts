import { isSupabaseConfigured, supabase, supabaseConfigMessage } from './supabaseClient';

interface BillingRouteResponse {
  url: string;
}

export const getCurrentUserToken = async () => {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error(supabaseConfigMessage);
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error('Please log in to continue.');
  }

  return session.access_token;
};

const postBillingRoute = async (route: string) => {
  const token = await getCurrentUserToken();
  const response = await fetch(route, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | BillingRouteResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload && 'error' in payload && payload.error ? payload.error : 'Unable to start billing right now.');
  }

  if (!payload || !('url' in payload) || !payload.url) {
    throw new Error('Unable to start billing right now.');
  }

  return payload.url;
};

export const startPlusCheckout = async () => {
  const url = await postBillingRoute('/api/create-checkout-session');
  window.location.assign(url);
};

export const openBillingPortal = async () => {
  const url = await postBillingRoute('/api/create-portal-session');
  window.location.assign(url);
};