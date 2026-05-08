import { useCallback, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export type TripPurpose =
  | 'leisure'
  | 'business'
  | 'remote-work'
  | 'family-group-travel'
  | 'long-stay-exploration';

export type PreferredTripLength = 'under-7-days' | '1-2-weeks' | '30-90-days' | 'flexible';

export type BudgetStyle = 'value-focused' | 'balanced' | 'comfort-focused' | 'premium';

export type RiskTolerance = 'cautious' | 'balanced' | 'flexible';

export type TravelPace = 'slow' | 'balanced' | 'fast';

export type RemoteWorkImportance = 'low' | 'medium' | 'high';

export type NotificationPreference =
  | 'major-changes-only'
  | 'weekly-summary'
  | 'before-booking'
  | 'before-departure';

export interface TravelerProfile {
  displayName: string;
  passportCountry: string;
  residenceCountry: string;
  homeCurrency: string;
  tripPurpose: TripPurpose;
  preferredTripLength: PreferredTripLength;
  budgetStyle: BudgetStyle;
  riskTolerance: RiskTolerance;
  travelPace: TravelPace;
  remoteWorkImportance: RemoteWorkImportance;
  planningNote: string;
  notificationPreference: NotificationPreference;
}

interface TravelerProfileRow {
  user_id: string;
  display_name: string | null;
  passport_country: string | null;
  residence_country: string | null;
  home_currency: string | null;
  trip_purpose: string | null;
  preferred_trip_length: string | null;
  budget_style: string | null;
  risk_tolerance: string | null;
  travel_pace: string | null;
  remote_work_importance: string | null;
  planning_note: string | null;
  notification_preference: string | null;
  updated_at: string | null;
}

interface SaveResult {
  ok: boolean;
  message: string;
}

type StorageMode = 'local' | 'supabase';

export const TRAVELER_PROFILE_STORAGE_KEY = 'atlasbrief_traveler_profile';

export const tripPurposeLabels: Record<TripPurpose, string> = {
  leisure: 'Leisure',
  business: 'Business',
  'remote-work': 'Remote work',
  'family-group-travel': 'Family/group travel',
  'long-stay-exploration': 'Long-stay exploration',
};

export const preferredTripLengthLabels: Record<PreferredTripLength, string> = {
  'under-7-days': 'Under 7 days',
  '1-2-weeks': '1-2 weeks',
  '30-90-days': '30-90 days',
  flexible: 'Flexible',
};

export const budgetStyleLabels: Record<BudgetStyle, string> = {
  'value-focused': 'Value-focused',
  balanced: 'Balanced',
  'comfort-focused': 'Comfort-focused',
  premium: 'Premium',
};

export const riskToleranceLabels: Record<RiskTolerance, string> = {
  cautious: 'Cautious',
  balanced: 'Balanced',
  flexible: 'Flexible',
};

export const travelPaceLabels: Record<TravelPace, string> = {
  slow: 'Slow',
  balanced: 'Balanced',
  fast: 'Fast',
};

export const remoteWorkImportanceLabels: Record<RemoteWorkImportance, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const notificationPreferenceLabels: Record<NotificationPreference, string> = {
  'major-changes-only': 'Major changes only',
  'weekly-summary': 'Weekly summary',
  'before-booking': 'Before booking',
  'before-departure': 'Before departure',
};

export const defaultTravelerProfile: TravelerProfile = {
  displayName: '',
  passportCountry: '',
  residenceCountry: '',
  homeCurrency: 'USD',
  tripPurpose: 'leisure',
  preferredTripLength: '1-2-weeks',
  budgetStyle: 'balanced',
  riskTolerance: 'balanced',
  travelPace: 'balanced',
  remoteWorkImportance: 'medium',
  planningNote: '',
  notificationPreference: 'weekly-summary',
};

const profileCompletionFields: (keyof TravelerProfile)[] = [
  'displayName',
  'passportCountry',
  'residenceCountry',
  'homeCurrency',
  'tripPurpose',
  'preferredTripLength',
  'budgetStyle',
  'riskTolerance',
  'travelPace',
  'remoteWorkImportance',
  'notificationPreference',
];

const isTripPurpose = (value: string): value is TripPurpose =>
  value === 'leisure' ||
  value === 'business' ||
  value === 'remote-work' ||
  value === 'family-group-travel' ||
  value === 'long-stay-exploration';

const isPreferredTripLength = (value: string): value is PreferredTripLength =>
  value === 'under-7-days' || value === '1-2-weeks' || value === '30-90-days' || value === 'flexible';

const isBudgetStyle = (value: string): value is BudgetStyle =>
  value === 'value-focused' || value === 'balanced' || value === 'comfort-focused' || value === 'premium';

const isRiskTolerance = (value: string): value is RiskTolerance =>
  value === 'cautious' || value === 'balanced' || value === 'flexible';

const isTravelPace = (value: string): value is TravelPace =>
  value === 'slow' || value === 'balanced' || value === 'fast';

const isRemoteWorkImportance = (value: string): value is RemoteWorkImportance =>
  value === 'low' || value === 'medium' || value === 'high';

const isNotificationPreference = (value: string): value is NotificationPreference =>
  value === 'major-changes-only' ||
  value === 'weekly-summary' ||
  value === 'before-booking' ||
  value === 'before-departure';

const sanitizeProfile = (candidate: Partial<TravelerProfile> | null | undefined): TravelerProfile => ({
  displayName: candidate?.displayName?.trim() ?? defaultTravelerProfile.displayName,
  passportCountry: candidate?.passportCountry?.trim() ?? defaultTravelerProfile.passportCountry,
  residenceCountry: candidate?.residenceCountry?.trim() ?? defaultTravelerProfile.residenceCountry,
  homeCurrency: candidate?.homeCurrency?.trim() ?? defaultTravelerProfile.homeCurrency,
  tripPurpose:
    typeof candidate?.tripPurpose === 'string' && isTripPurpose(candidate.tripPurpose)
      ? candidate.tripPurpose
      : defaultTravelerProfile.tripPurpose,
  preferredTripLength:
    typeof candidate?.preferredTripLength === 'string' && isPreferredTripLength(candidate.preferredTripLength)
      ? candidate.preferredTripLength
      : defaultTravelerProfile.preferredTripLength,
  budgetStyle:
    typeof candidate?.budgetStyle === 'string' && isBudgetStyle(candidate.budgetStyle)
      ? candidate.budgetStyle
      : defaultTravelerProfile.budgetStyle,
  riskTolerance:
    typeof candidate?.riskTolerance === 'string' && isRiskTolerance(candidate.riskTolerance)
      ? candidate.riskTolerance
      : defaultTravelerProfile.riskTolerance,
  travelPace:
    typeof candidate?.travelPace === 'string' && isTravelPace(candidate.travelPace)
      ? candidate.travelPace
      : defaultTravelerProfile.travelPace,
  remoteWorkImportance:
    typeof candidate?.remoteWorkImportance === 'string' && isRemoteWorkImportance(candidate.remoteWorkImportance)
      ? candidate.remoteWorkImportance
      : defaultTravelerProfile.remoteWorkImportance,
  planningNote: candidate?.planningNote?.trim() ?? defaultTravelerProfile.planningNote,
  notificationPreference:
    typeof candidate?.notificationPreference === 'string' && isNotificationPreference(candidate.notificationPreference)
      ? candidate.notificationPreference
      : defaultTravelerProfile.notificationPreference,
});

const mapRowToProfile = (row: TravelerProfileRow): TravelerProfile =>
  sanitizeProfile({
    displayName: row.display_name ?? '',
    passportCountry: row.passport_country ?? '',
    residenceCountry: row.residence_country ?? '',
    homeCurrency: row.home_currency ?? '',
    tripPurpose: row.trip_purpose ?? '',
    preferredTripLength: row.preferred_trip_length ?? '',
    budgetStyle: row.budget_style ?? '',
    riskTolerance: row.risk_tolerance ?? '',
    travelPace: row.travel_pace ?? '',
    remoteWorkImportance: row.remote_work_importance ?? '',
    planningNote: row.planning_note ?? '',
    notificationPreference: row.notification_preference ?? '',
  });

const mapProfileToRow = (profile: TravelerProfile, userId: string) => ({
  user_id: userId,
  display_name: profile.displayName || null,
  passport_country: profile.passportCountry || null,
  residence_country: profile.residenceCountry || null,
  home_currency: profile.homeCurrency || null,
  trip_purpose: profile.tripPurpose,
  preferred_trip_length: profile.preferredTripLength,
  budget_style: profile.budgetStyle,
  risk_tolerance: profile.riskTolerance,
  travel_pace: profile.travelPace,
  remote_work_importance: profile.remoteWorkImportance,
  planning_note: profile.planningNote || null,
  notification_preference: profile.notificationPreference,
  updated_at: new Date().toISOString(),
});

const safeReadLocalProfile = (): TravelerProfile | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(TRAVELER_PROFILE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<TravelerProfile>;
    return sanitizeProfile(parsed);
  } catch {
    return null;
  }
};

const safeWriteLocalProfile = (profile: TravelerProfile) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(TRAVELER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Keep profile editing usable even when storage is unavailable.
  }
};

const safeClearLocalProfile = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(TRAVELER_PROFILE_STORAGE_KEY);
  } catch {
    // Do not block UI flows when storage is unavailable.
  }
};

const getCompletenessScore = (profile: TravelerProfile): number => {
  const complete = profileCompletionFields.filter((field) => {
    const value = profile[field];
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return value !== null && value !== undefined;
  }).length;

  return Math.round((complete / profileCompletionFields.length) * 100);
};

interface UseTravelerProfileResult {
  profile: TravelerProfile;
  setProfile: (next: TravelerProfile) => void;
  updateField: <K extends keyof TravelerProfile>(key: K, value: TravelerProfile[K]) => void;
  resetLocalProfile: () => void;
  saveProfile: () => Promise<SaveResult>;
  completenessScore: number;
  loading: boolean;
  saving: boolean;
  mode: StorageMode;
  message: string | null;
  error: string | null;
}

export const useTravelerProfile = (): UseTravelerProfileResult => {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<TravelerProfile>(defaultTravelerProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<StorageMode>('local');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const localProfile = safeReadLocalProfile();

    if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
      setProfile(localProfile ?? defaultTravelerProfile);
      setMode('local');
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from('traveler_profiles')
      .select(
        'user_id, display_name, passport_country, residence_country, home_currency, trip_purpose, preferred_trip_length, budget_style, risk_tolerance, travel_pace, remote_work_importance, planning_note, notification_preference, updated_at'
      )
      .eq('user_id', user.id)
      .maybeSingle<TravelerProfileRow>();

    if (queryError) {
      setProfile(localProfile ?? defaultTravelerProfile);
      setMode('local');
      setLoading(false);
      return;
    }

    if (data) {
      const fromSupabase = mapRowToProfile(data);
      setProfile(fromSupabase);
      safeWriteLocalProfile(fromSupabase);
      setMode('supabase');
      setLoading(false);
      return;
    }

    setProfile(localProfile ?? defaultTravelerProfile);
    setMode(localProfile ? 'local' : 'supabase');
    setLoading(false);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateField = useCallback(
    <K extends keyof TravelerProfile>(key: K, value: TravelerProfile[K]) => {
      setProfile((current) => ({ ...current, [key]: value }));
      setMessage(null);
      setError(null);
    },
    []
  );

  const resetLocalProfile = useCallback(() => {
    safeClearLocalProfile();
    setProfile(defaultTravelerProfile);
    setMode('local');
    setMessage('Local traveler profile reset.');
    setError(null);
  }, []);

  const saveProfile = useCallback(async (): Promise<SaveResult> => {
    setSaving(true);
    setMessage(null);
    setError(null);

    const sanitized = sanitizeProfile(profile);
    setProfile(sanitized);
    safeWriteLocalProfile(sanitized);

    if (!isAuthenticated || !user?.id || !isSupabaseConfigured || !supabase) {
      setMode('local');
      const localMessage = 'Planning preferences saved locally.';
      setMessage(localMessage);
      setSaving(false);
      return { ok: true, message: localMessage };
    }

    try {
      const payload = mapProfileToRow(sanitized, user.id);

      const { data: updatedRows, error: updateError } = await supabase
        .from('traveler_profiles')
        .update(payload)
        .eq('user_id', user.id)
        .select('user_id')
        .limit(1);

      if (updateError) {
        throw updateError;
      }

      if (!updatedRows || updatedRows.length === 0) {
        const { error: insertError } = await supabase
          .from('traveler_profiles')
          .insert(payload)
          .select('user_id')
          .limit(1);

        if (insertError) {
          throw insertError;
        }
      }

      setMode('supabase');
      const okMessage = 'Planning preferences saved.';
      setMessage(okMessage);
      setSaving(false);
      return { ok: true, message: okMessage };
    } catch {
      setMode('local');
      const fallbackMessage = 'Saved locally. Supabase profile sync is unavailable right now.';
      setError(fallbackMessage);
      setSaving(false);
      return { ok: false, message: fallbackMessage };
    }
  }, [isAuthenticated, profile, user?.id]);

  const completenessScore = useMemo(() => getCompletenessScore(profile), [profile]);

  return {
    profile,
    setProfile,
    updateField,
    resetLocalProfile,
    saveProfile,
    completenessScore,
    loading,
    saving,
    mode,
    message,
    error,
  };
};
