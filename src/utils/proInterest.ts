const PRO_INTEREST_KEY = 'atlasbrief-pro-interest-v1';

export interface ProInterestRecord {
  proInterest: true;
  timestamp: string;
}

export const getProInterestRecord = (): ProInterestRecord | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PRO_INTEREST_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<ProInterestRecord>;
    if (parsed?.proInterest === true && typeof parsed.timestamp === 'string') {
      return {
        proInterest: true,
        timestamp: parsed.timestamp,
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const saveProInterestRecord = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload: ProInterestRecord = {
      proInterest: true,
      timestamp: new Date().toISOString(),
    };

    window.localStorage.setItem(PRO_INTEREST_KEY, JSON.stringify(payload));
  } catch {
    // Prototype-only action: silently ignore storage failures.
  }
};

export const PRO_INTEREST_STORAGE_KEY = PRO_INTEREST_KEY;