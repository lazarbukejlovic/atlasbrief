import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

type BillingLookupRow = {
  user_id: string;
};

const ACTIVE_PLUS_STATUSES = new Set<Stripe.Subscription.Status>(['active', 'trialing']);

const getRequiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getSupabaseAdmin = () => {
  const supabaseUrl = getRequiredEnv('SUPABASE_URL');
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const directBody = (req as VercelRequest & { body?: unknown }).body;
    if (Buffer.isBuffer(directBody)) {
      resolve(directBody);
      return;
    }

    if (typeof directBody === 'string') {
      resolve(Buffer.from(directBody));
      return;
    }

    if (directBody && typeof directBody === 'object') {
      console.warn('[stripe-webhook] falling back to JSON body for signature verification; this may fail');
      resolve(Buffer.from(JSON.stringify(directBody)));
      return;
    }

    if ((req as VercelRequest & { complete?: boolean }).complete || req.readableEnded) {
      resolve(Buffer.alloc(0));
      return;
    }

    const chunks: Buffer[] = [];
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeout);
      req.off('data', onData);
      req.off('end', onEnd);
      req.off('error', onError);
      req.off('aborted', onAborted);
      req.off('close', onClose);
    };

    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      callback();
    };

    const onData = (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    };

    const onEnd = () => {
      finish(() => resolve(Buffer.concat(chunks)));
    };

    const onError = (error: Error) => {
      finish(() => reject(error));
    };

    const onAborted = () => {
      finish(() => reject(new Error('Raw body read aborted')));
    };

    const onClose = () => {
      if (!settled && ((req as VercelRequest & { complete?: boolean }).complete || req.readableEnded)) {
        finish(() => resolve(Buffer.concat(chunks)));
      }
    };

    const timeout = setTimeout(() => {
      finish(() => reject(new Error('Raw body read timed out')));
    }, 5000);

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
    req.on('aborted', onAborted);
    req.on('close', onClose);
  });
}

const toIsoFromUnixSeconds = (timestamp?: number | null) => {
  if (!timestamp) {
    return null;
  }

  return new Date(timestamp * 1000).toISOString();
};

const getCustomerId = (value: string | Stripe.Customer | Stripe.DeletedCustomer | null) => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.id;
};

const getSubscriptionId = (value: string | Stripe.Subscription | null) => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.id;
};

const mapPlanFromStatus = (status: Stripe.Subscription.Status | null | undefined) =>
  status && ACTIVE_PLUS_STATUSES.has(status) ? 'plus' : 'free';

const isLocalDevelopment = () => {
  return (
    process.env.NODE_ENV !== 'production' ||
    process.env.VERCEL_ENV === 'development' ||
    Boolean(process.env.APP_URL?.includes('localhost'))
  );
};

const logSupabaseUpdateError = (error: unknown) => {
  const details = error as { message?: string; code?: string };
  console.error('[stripe-webhook] supabase update failed', {
    message: details?.message ?? 'Unknown Supabase error',
    code: details?.code ?? null,
  });
};

const lookupUserIdFromBilling = async (
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  subscriptionId: string | null,
  customerId: string | null
) => {
  if (subscriptionId) {
    const { data, error } = await supabaseAdmin
      .from('user_billing')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle<BillingLookupRow>();

    if (error) {
      throw error;
    }

    if (data?.user_id) {
      return data.user_id;
    }
  }

  if (customerId) {
    const { data, error } = await supabaseAdmin
      .from('user_billing')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle<BillingLookupRow>();

    if (error) {
      throw error;
    }

    if (data?.user_id) {
      return data.user_id;
    }
  }

  return null;
};

const resolveUserIdFromSubscription = async (
  subscription: Stripe.Subscription,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>
) => {
  const metadataUserId = subscription.metadata?.userId?.trim();
  if (metadataUserId) {
    return metadataUserId;
  }

  return lookupUserIdFromBilling(
    supabaseAdmin,
    subscription.id ?? null,
    getCustomerId(subscription.customer)
  );
};

const respondIgnored = (res: VercelResponse) => {
  return res.status(200).json({ received: true, ignored: true });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[stripe-webhook] entered handler', { method: req.method });
  console.log('[stripe-webhook] env/header check', {
    hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    hasSignature: Boolean(req.headers['stripe-signature']),
  });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const signatureHeader = req.headers['stripe-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature.' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    return res.status(400).json({ error: 'Missing Stripe webhook configuration.' });
  }

  let rawBody: Buffer;
  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown raw body read failure';
    console.error('[stripe-webhook] raw body read failed', message);
    return res.status(400).json({ error: 'Unable to read webhook body.' });
  }

  console.log('[stripe-webhook] raw body read', { length: rawBody.length });

  const stripe = new Stripe(stripeSecretKey);
  const localDevMode = isLocalDevelopment();

  let event: Stripe.Event;
  let usedLocalFallback = false;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signature verification failed.';
    console.error('[stripe-webhook] signature verification failed', message);

    if (!localDevMode) {
      return res.status(400).json({ error: 'Invalid Stripe signature.' });
    }

    console.warn('[stripe-webhook] local dev fallback: parsing unverified Stripe event');

    try {
      const parsed = JSON.parse(rawBody.toString('utf8')) as Stripe.Event;
      if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
        return res.status(400).json({ error: 'Invalid Stripe event payload.' });
      }
      event = parsed;
      usedLocalFallback = true;
    } catch (parseError) {
      const parseMessage = parseError instanceof Error ? parseError.message : 'Invalid JSON payload';
      console.error('[stripe-webhook] local fallback parse failed', parseMessage);
      return res.status(400).json({ error: 'Invalid Stripe event payload.' });
    }
  }

  console.log('[stripe-webhook] verified event', { type: event.type, usedLocalFallback });

  let supabaseAdmin: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Supabase client failure';
    console.error('[stripe-webhook] request failed', { message });
    return res.status(500).json({ error: 'Webhook handling failed.' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') {
        return respondIgnored(res);
      }

      const subscriptionId = getSubscriptionId(session.subscription as string | Stripe.Subscription | null);
      const customerId = getCustomerId(session.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null);
      let userId = session.client_reference_id ?? session.metadata?.userId ?? null;
      let subscriptionStatus: Stripe.Subscription.Status | null = null;
      let currentPeriodEnd: string | null = null;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        subscriptionStatus = subscription.status;
        currentPeriodEnd = toIsoFromUnixSeconds(subscription.current_period_end);
        userId = userId ?? subscription.metadata?.userId?.trim() ?? null;
      }

      if (!userId) {
        console.log('[stripe-webhook] checkout user mapping', {
          type: event.type,
          usedLocalFallback,
          hasUserId: false,
        });
        return respondIgnored(res);
      }

      console.log('[stripe-webhook] checkout user mapping', {
        type: event.type,
        usedLocalFallback,
        hasUserId: true,
      });

      const { error } = await supabaseAdmin.from('user_billing').upsert(
        {
          user_id: userId,
          plan: mapPlanFromStatus(subscriptionStatus),
          subscription_status: subscriptionStatus,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        logSupabaseUpdateError(error);
        return res.status(500).json({ error: 'Failed to update billing state.' });
      }

      return res.status(200).json({ received: true });
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = getCustomerId(subscription.customer);
      const userId = await resolveUserIdFromSubscription(subscription, supabaseAdmin);

      if (!userId) {
        console.log('[stripe-webhook] subscription user mapping', {
          type: event.type,
          usedLocalFallback,
          hasUserId: false,
        });
        return respondIgnored(res);
      }

      console.log('[stripe-webhook] subscription user mapping', {
        type: event.type,
        usedLocalFallback,
        hasUserId: true,
      });

      const plan =
        event.type === 'customer.subscription.deleted' ? 'free' : mapPlanFromStatus(subscription.status);
      const subscriptionStatus =
        event.type === 'customer.subscription.deleted' ? subscription.status ?? 'canceled' : subscription.status;

      const { error } = await supabaseAdmin.from('user_billing').upsert(
        {
          user_id: userId,
          plan,
          subscription_status: subscriptionStatus,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          current_period_end: toIsoFromUnixSeconds(subscription.current_period_end),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        logSupabaseUpdateError(error);
        return res.status(500).json({ error: 'Failed to update billing state.' });
      }

      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook failure.';
    console.error('[stripe-webhook] request failed', { message });
    return res.status(500).json({ error: 'Webhook handling failed.' });
  }
}
