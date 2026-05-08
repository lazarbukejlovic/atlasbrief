import { Save, UserCircle2 } from 'lucide-react';
import { useTravelerProfile } from '../hooks/useTravelerProfile';
import {
  budgetStyleLabels,
  notificationPreferenceLabels,
  preferredTripLengthLabels,
  remoteWorkImportanceLabels,
  riskToleranceLabels,
  travelPaceLabels,
  tripPurposeLabels,
  type BudgetStyle,
  type NotificationPreference,
  type PreferredTripLength,
  type RemoteWorkImportance,
  type RiskTolerance,
  type TravelPace,
  type TripPurpose,
} from '../hooks/useTravelerProfile';

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const Profile = () => {
  const {
    profile,
    updateField,
    saveProfile,
    resetLocalProfile,
    completenessScore,
    loading,
    saving,
    mode,
    message,
    error,
  } = useTravelerProfile();

  const readinessContextSummary = [
    `${tripPurposeLabels[profile.tripPurpose]} travel context`,
    `${budgetStyleLabels[profile.budgetStyle]} budget style`,
    `${riskToleranceLabels[profile.riskTolerance]} risk preference`,
    `${preferredTripLengthLabels[profile.preferredTripLength]} planning horizon`,
  ].join(' · ');

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-sky-accent/20 p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Traveler Profile</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Personalize your travel-readiness context.
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          AtlasBrief uses your travel profile to shape readiness summaries, planning guidance, alerts, and reports.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Profile completeness</div>
          <p className="mt-2 text-3xl font-semibold text-navy">{completenessScore}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
            <div className="h-full rounded-full bg-sky-accent" style={{ width: `${completenessScore}%` }} />
          </div>
          <p className="mt-3 text-sm text-navy-muted">
            This profile captures planning preferences only. Do not enter passport numbers, ID numbers, private documents, or exact health information.
          </p>
        </article>

        <article className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sand">
            <UserCircle2 className="h-4 w-4" />
            Readiness context
          </div>
          <h2 className="mt-2 text-xl font-semibold text-navy">Your current personalization summary</h2>
          <p className="mt-2 text-sm leading-7 text-navy-muted">{readinessContextSummary}</p>
          <p className="mt-3 text-xs text-navy-muted">Data mode: {mode === 'supabase' ? 'Supabase profile sync' : 'Local planning profile'}</p>
        </article>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Display name / traveler label</span>
            <input
              type="text"
              value={profile.displayName}
              onChange={(event) => updateField('displayName', event.target.value)}
              placeholder="Alex, Family coordinator, Team travel lead..."
              className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Citizenship / passport country placeholder</span>
            <input
              type="text"
              value={profile.passportCountry}
              onChange={(event) => updateField('passportCountry', event.target.value)}
              placeholder="United States"
              className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Residence country</span>
            <input
              type="text"
              value={profile.residenceCountry}
              onChange={(event) => updateField('residenceCountry', event.target.value)}
              placeholder="United States"
              className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Home currency</span>
            <input
              type="text"
              value={profile.homeCurrency}
              onChange={(event) => updateField('homeCurrency', event.target.value.toUpperCase())}
              placeholder="USD"
              className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            />
          </label>

          <SelectField<TripPurpose>
            label="Usual trip purpose"
            value={profile.tripPurpose}
            onChange={(value) => updateField('tripPurpose', value)}
            options={Object.entries(tripPurposeLabels).map(([value, label]) => ({ value: value as TripPurpose, label }))}
          />

          <SelectField<PreferredTripLength>
            label="Preferred trip length"
            value={profile.preferredTripLength}
            onChange={(value) => updateField('preferredTripLength', value)}
            options={Object.entries(preferredTripLengthLabels).map(([value, label]) => ({
              value: value as PreferredTripLength,
              label,
            }))}
          />

          <SelectField<BudgetStyle>
            label="Budget style"
            value={profile.budgetStyle}
            onChange={(value) => updateField('budgetStyle', value)}
            options={Object.entries(budgetStyleLabels).map(([value, label]) => ({ value: value as BudgetStyle, label }))}
          />

          <SelectField<RiskTolerance>
            label="Risk tolerance"
            value={profile.riskTolerance}
            onChange={(value) => updateField('riskTolerance', value)}
            options={Object.entries(riskToleranceLabels).map(([value, label]) => ({ value: value as RiskTolerance, label }))}
          />

          <SelectField<TravelPace>
            label="Travel pace"
            value={profile.travelPace}
            onChange={(value) => updateField('travelPace', value)}
            options={Object.entries(travelPaceLabels).map(([value, label]) => ({ value: value as TravelPace, label }))}
          />

          <SelectField<RemoteWorkImportance>
            label="Remote-work importance"
            value={profile.remoteWorkImportance}
            onChange={(value) => updateField('remoteWorkImportance', value)}
            options={Object.entries(remoteWorkImportanceLabels).map(([value, label]) => ({
              value: value as RemoteWorkImportance,
              label,
            }))}
          />

          <SelectField<NotificationPreference>
            label="Notification preference placeholder"
            value={profile.notificationPreference}
            onChange={(value) => updateField('notificationPreference', value)}
            options={Object.entries(notificationPreferenceLabels).map(([value, label]) => ({
              value: value as NotificationPreference,
              label,
            }))}
          />

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Accessibility / health planning note placeholder</span>
            <textarea
              value={profile.planningNote}
              onChange={(event) => updateField('planningNote', event.target.value)}
              placeholder="Optional planning note for access, mobility, or routine preparation."
              rows={4}
              className="mt-1.5 w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-navy shadow-soft outline-none focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/20"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save profile'}
          </button>

          <button
            type="button"
            onClick={resetLocalProfile}
            className="rounded-2xl border border-white/70 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80"
          >
            Reset local profile
          </button>

          <span className="text-xs text-navy-muted">This is a planning profile, not official travel documentation.</span>
        </div>

        {message ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
            {error}
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.75rem] border border-sky-accent/10 bg-sky-soft/50 p-5">
        <p className="text-sm leading-relaxed text-navy-muted">
          <span className="font-semibold text-navy">Planning preferences only.</span> AtlasBrief does not require passport numbers, ID numbers, or private documents for this profile. Review official sources before travel.
        </p>
      </section>
    </div>
  );
};

export default Profile;