import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

type BillingRow = {
  user_id: string;
  stripe_customer_id: string | null;
};

type DiagnosticError = Error & {
  step?: string;
  stripeType?: string;
  stripeCode?: string;
  supabaseMessage?: string;
  supabaseCode?: string;
};

const isProduction = process.env.NODE_ENV === 'production';

const responseWithDebug = (
  response: VercelResponse,
  statusCode: number,
  error: string,
  debug?: string
) => {
  if (isProduction || !debug) {
    return response.status(statusCode).json({ error });
  }

  return response.status(statusCode).json({ error, debug });
};

const asDiagnosticError = (error: unknown, step: string): DiagnosticError => {
  let typedError: DiagnosticError;
  if (error instanceof Error) {
    typedError = error as DiagnosticError;
  } else {
    const plain = error as { message?: string };
    typedError = new Error(plain?.message ?? 'Unknown error') as DiagnosticError;
  }
  typedError.step = typedError.step ?? step;

  const stripeError = error as { type?: string; code?: string };
  if (stripeError?.type) {
    typedError.stripeType = stripeError.type;
  }
  if (stripeError?.code) {
    typedError.stripeCode = String(stripeError.code);
  }

  const supabaseError = error as { message?: string; code?: string };
  if (supabaseError?.message) {
    typedError.supabaseMessage = supabaseError.message;
  }
  if (supabaseError?.code) {
    typedError.supabaseCode = String(supabaseError.code);
  }

  return typedError;
};

const buildDebugReason = (step: string, message?: string) => {
  if (!message) {
    return `${step} failed`;
  }

  return `${step} failed: ${message}`;
};

const getEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const getSupabaseUrl = () => {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  if (!url) throw new Error('Missing Supabase URL.');
  return url;
};

// Used only for auth.getUser(token) — must use the anon/publishable key, not the service role key.
const getSupabaseAuthClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Used only for privileged database operations — must use the service role key.
const getSupabaseAdminClient = () => {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

const getBearerToken = (request: VercelRequest) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return null;
  }

  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  return match ? match[1] : null;
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  let step = 'step-1-method-checked';
  console.info('[create-portal-session] step 1 method checked', { method: request.method });

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    step = 'step-2-env-presence-checked';
    const envPresence = {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL),
      hasSupabasePublishableKey: Boolean(process.env.VITE_SUPABASE_PUBLISHABLE_KEY),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
      hasAppUrl: Boolean(process.env.APP_URL),
    };
    console.info('[create-portal-session] step 2 env presence checked', envPresence);

    if (
      !envPresence.hasSupabaseUrl ||
      !envPresence.hasSupabasePublishableKey ||
      !envPresence.hasServiceRoleKey ||
      !envPresence.hasStripeSecretKey ||
      !envPresence.hasAppUrl
    ) {
      const envError = new Error('Missing one or more required server environment variables.') as DiagnosticError;
      envError.step = step;
      throw envError;
    }

    step = 'step-3-bearer-token-found';
    const token = getBearerToken(request);
    console.info('[create-portal-session] step 3 bearer token found', {
      hasBearerToken: Boolean(token),
    });

    if (!token) {
      return responseWithDebug(response, 401, 'Authentication is required.', 'Missing bearer token.');
    }

    step = 'step-4-supabase-clients-created';
    const supabaseUrlPrefix = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '').slice(0, 32);
    const supabaseAuthClient = getSupabaseAuthClient();
    const supabaseAdminClient = getSupabaseAdminClient();
    console.info('[create-portal-session] step 4 Supabase clients created', { supabaseUrlPrefix });

    const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'));
    const appUrl = getEnv('APP_URL');

    step = 'step-5-user-validation';
    console.info('[create-portal-session] step 5 calling auth.getUser', { hasToken: Boolean(token) });
    const {
      data: { user },
      error: userError,
    } = await supabaseAuthClient.auth.getUser(token);

    if (userError || !user) {
      console.info('[create-portal-session] step 5 user validation failed', {
        hasUser: Boolean(user),
        errorName: userError?.name,
        errorMessage: userError?.message,
        errorStatus: (userError as { status?: number })?.status,
      });
      return responseWithDebug(
        response,
        401,
        'Authentication is required.',
        userError?.message ?? 'No user returned for the provided token.'
      );
    }
    console.info('[create-portal-session] step 5 user validation succeeded', { hasUser: true });

    step = 'step-6-user-billing-row-checked';
    const { data: billingRow, error: billingError } = await supabaseAdminClient
      .from('user_billing')
      .select('user_id, stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle<BillingRow>();
    console.info('[create-portal-session] step 6 user_billing row checked', {
      hasBillingRow: Boolean(billingRow),
      hasStripeCustomerId: Boolean(billingRow?.stripe_customer_id),
      billingErrorMessage: billingError?.message ?? null,
      billingErrorCode: (billingError as { code?: string } | null)?.code ?? null,
    });

    if (billingError) {
      const errorWithStep = asDiagnosticError(billingError, step);
      throw errorWithStep;
    }

    if (!billingRow?.stripe_customer_id) {
      return responseWithDebug(
        response,
        400,
        'No billing profile is available for this account yet.',
        'No stripe customer id found for this user.'
      );
    }

    step = 'step-7-portal-session-creation-attempted';
    console.info('[create-portal-session] step 7 portal session creation attempted');
    const portal = await stripe.billingPortal.sessions.create({
      customer: billingRow.stripe_customer_id,
      return_url: `${appUrl}/account`,
    });

    return response.status(200).json({ url: portal.url });
  } catch (error) {
    const diagnostic = asDiagnosticError(error, step);
    console.error('[create-portal-session] request failed', {
      step: diagnostic.step ?? step,
      errorName: diagnostic.name,
      errorMessage: diagnostic.message,
      stripeType: diagnostic.stripeType,
      stripeCode: diagnostic.stripeCode,
      supabaseMessage: diagnostic.supabaseMessage,
      supabaseCode: diagnostic.supabaseCode,
    });

    return responseWithDebug(
      response,
      500,
      'Unable to open billing right now.',
      buildDebugReason(diagnostic.step ?? step, diagnostic.message)
    );
  }
}