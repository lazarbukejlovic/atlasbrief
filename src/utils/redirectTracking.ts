import type { PartnerCategory, PartnerOffer } from '../data/partnerOffers';

const PARTNER_REDIRECT_STORAGE_KEY = 'atlasbrief-partner-redirect-events-v1';

export interface PartnerRedirectEvent {
  partnerId: string;
  category: PartnerCategory;
  destinationId?: string;
  timestamp: string;
}

export interface PartnerRedirectMetrics {
  totalPartnerClicks: number;
  topClickedCategory: string;
  lastClickedPartner: string;
}

const safeReadEvents = (): PartnerRedirectEvent[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PARTNER_REDIRECT_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is PartnerRedirectEvent => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      const maybe = item as Partial<PartnerRedirectEvent>;
      return Boolean(
        maybe.partnerId &&
          maybe.category &&
          maybe.timestamp &&
          typeof maybe.partnerId === 'string' &&
          typeof maybe.category === 'string' &&
          typeof maybe.timestamp === 'string'
      );
    });
  } catch {
    return [];
  }
};

const safeWriteEvents = (events: PartnerRedirectEvent[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(PARTNER_REDIRECT_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Do not block redirect flow when storage is unavailable.
  }
};

export const trackPartnerRedirect = (payload: { partnerId: string; category: PartnerCategory; destinationId?: string }) => {
  const nextEvent: PartnerRedirectEvent = {
    partnerId: payload.partnerId,
    category: payload.category,
    destinationId: payload.destinationId,
    timestamp: new Date().toISOString(),
  };

  const existing = safeReadEvents();
  safeWriteEvents([nextEvent, ...existing].slice(0, 250));
};

export const openTrackedPartnerRedirect = (
  offer: PartnerOffer,
  options?: { destinationId?: string; onTracked?: () => void }
) => {
  trackPartnerRedirect({
    partnerId: offer.id,
    category: offer.category,
    destinationId: options?.destinationId,
  });

  if (options?.onTracked) {
    options.onTracked();
  }

  if (typeof window === 'undefined') {
    return;
  }

  window.open(offer.externalUrl, '_blank', 'noopener,noreferrer');
};

export const getPartnerRedirectEvents = (): PartnerRedirectEvent[] => safeReadEvents();

export const getPartnerRedirectMetrics = (offers: PartnerOffer[]): PartnerRedirectMetrics => {
  const events = safeReadEvents();

  if (events.length === 0) {
    return {
      totalPartnerClicks: 0,
      topClickedCategory: 'No clicks yet',
      lastClickedPartner: 'None yet',
    };
  }

  const categoryCounts = events.reduce<Record<string, number>>((accumulator, event) => {
    accumulator[event.category] = (accumulator[event.category] ?? 0) + 1;
    return accumulator;
  }, {});

  const topCategory = Object.entries(categoryCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'Unknown';
  const offerMap = new Map(offers.map((offer) => [offer.id, offer]));
  const lastEvent = events[0];

  return {
    totalPartnerClicks: events.length,
    topClickedCategory: topCategory,
    lastClickedPartner: offerMap.get(lastEvent.partnerId)?.title ?? lastEvent.partnerId,
  };
};

export const PARTNER_REDIRECT_EVENTS_KEY = PARTNER_REDIRECT_STORAGE_KEY;