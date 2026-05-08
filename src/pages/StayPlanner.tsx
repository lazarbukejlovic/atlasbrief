import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  ChevronRight,
  Globe2,
  Wifi,
  Home,
  ShieldCheck,
  HeartPulse,
  Bus,
  DollarSign,
  FileText,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Info,
  Save,
  Trash2,
} from 'lucide-react';
import { destinations } from '../data/destinations';
import { getLongStayData } from '../data/longStayData';
import { useAuth } from '../hooks/useAuth';
import { useStayPlans } from '../hooks/useStayPlans';
import {
  computeFeasibilityReport,
  budgetRangeLabels,
  workStyleLabels,
  internetImportanceLabels,
  housingPreferenceLabels,
  riskToleranceLabels,
  recommendationMeta,
} from '../lib/stayPlanner';
import type {
  StayPlannerInputs,
  StayLength,
  BudgetRange,
  WorkStyle,
  InternetImportance,
  HousingPreference,
  RiskTolerance,
  StayFeasibilityReport,
} from '../lib/stayPlanner';

// ─── Small UI atoms ───────────────────────────────────────────────────────────

function ScoreBar({ value, color = 'sky' }: { value: number; color?: 'sky' | 'emerald' | 'amber' | 'red' }) {
  const colorClass = {
    sky: 'bg-sky-accent',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
  }[color];
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/60">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function scoreColor(value: number): 'sky' | 'emerald' | 'amber' | 'red' {
  if (value >= 75) return 'emerald';
  if (value >= 55) return 'sky';
  if (value >= 40) return 'amber';
  return 'red';
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-medium text-navy shadow-soft outline-none focus:border-sky-accent/50 focus:ring-2 focus:ring-sky-accent/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PillGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              value === opt.value
                ? 'bg-navy text-white shadow-soft'
                : 'border border-white/70 bg-white/80 text-navy-muted hover:border-sky-accent/30 hover:bg-white hover:text-navy'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Report sections ──────────────────────────────────────────────────────────

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <article className="glass-card rounded-[1.75rem] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sky-accent shadow-soft">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-navy">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-navy-muted">{label}</span>
        <span className="text-sm font-semibold text-navy">{value}</span>
      </div>
      <ScoreBar value={value} color={color} />
    </div>
  );
}

// ─── Full Report ──────────────────────────────────────────────────────────────

function FeasibilityReport({ report }: { report: StayFeasibilityReport }) {
  const { destination, longStay, inputs } = report;
  const recMeta = recommendationMeta[report.finalRecommendation];
  const visaShortfall = longStay.maxVisaFreeDays < inputs.stayLength;

  return (
    <div className="space-y-6">
      {/* Overall header */}
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Stay Feasibility Report</div>
        <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
          {destination.city}, {destination.country}
        </h2>
        <p className="mt-1 text-sm text-navy-muted">
          {inputs.stayLength}-day stay · {workStyleLabels[inputs.workStyle]} · {budgetRangeLabels[inputs.budgetRange]}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1fr] lg:grid-cols-[2fr_1fr_1fr]">
          {/* Big score */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">Overall Feasibility Score</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-tight text-navy">{report.overallScore}</span>
              <span className="mb-2 text-2xl text-navy-muted">/100</span>
            </div>
            <ScoreBar value={report.overallScore} color={scoreColor(report.overallScore)} />
          </div>

          {/* Monthly estimate */}
          <div className="rounded-2xl border border-white/70 bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">Est. Monthly Cost</p>
            <p className="mt-2 text-3xl font-semibold text-navy">${report.monthlyEstimate.toLocaleString()}</p>
            <p className="mt-1 text-xs text-navy-muted">
              {inputs.housingPreference} preference · static estimate
            </p>
          </div>

          {/* Total cost */}
          <div className="rounded-2xl border border-white/70 bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">
              {inputs.stayLength}-Day Total Est.
            </p>
            <p className="mt-2 text-3xl font-semibold text-navy">${report.totalEstimate.toLocaleString()}</p>
            <p className="mt-1 text-xs text-navy-muted">
              {inputs.stayLength / 30} × monthly estimate
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`mt-6 rounded-2xl border p-5 ${recMeta.bg} ${recMeta.border}`}>
          <p className={`text-sm font-semibold ${recMeta.color}`}>
            Final Assessment: {recMeta.label}
          </p>
          <p className={`mt-1.5 text-sm ${recMeta.color}`}>{recMeta.description}</p>
        </div>

        {/* Visa shortfall alert */}
        {visaShortfall && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              Your stay length ({inputs.stayLength} days) exceeds the visa-free limit ({longStay.maxVisaFreeDays} days) for {destination.country}. A longer-stay visa or permit is required. See the Visa Snapshot section below.
            </p>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Score breakdown */}
        <SectionCard icon={<TrendingUp className="h-5 w-5" />} title="Score Breakdown">
          <div className="space-y-4">
            <ScoreRow label="Affordability fit" value={report.affordabilityScore} />
            <ScoreRow label="Internet & connectivity" value={report.internetFitScore} />
            <ScoreRow label="Housing accessibility" value={report.housingFitScore} />
            <ScoreRow label="Safety & stability" value={report.safetyFitScore} />
            <ScoreRow label="Healthcare readiness" value={report.healthcareFitScore} />
            <ScoreRow label="Local transport" value={report.transportFitScore} />
          </div>
        </SectionCard>

        {/* Visa snapshot */}
        <SectionCard icon={<FileText className="h-5 w-5" />} title="Visa / Stay Rule Snapshot">
          <div className="space-y-3">
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Visa-free window</p>
              <p className="mt-1.5 text-2xl font-semibold text-navy">{longStay.maxVisaFreeDays} days</p>
              <p className="mt-1 text-sm text-navy-muted">{longStay.visaComplexity === 'simple' ? 'Simple process' : longStay.visaComplexity === 'moderate' ? 'Moderate process' : 'Complex — plan early'}</p>
            </div>
            <p className="text-sm leading-7 text-navy-muted">{longStay.stayRuleSummary}</p>
            <div className="rounded-2xl border border-sky-accent/20 bg-sky-50/70 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" />
                <p className="text-xs leading-6 text-navy-muted">
                  This is a planning snapshot only — not legal advice. Visa rules, entry requirements, and tax obligations change. Verify with the official embassy, consulate, or government immigration portal before booking.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Internet & remote work fit */}
        <SectionCard icon={<Wifi className="h-5 w-5" />} title="Internet & Remote Work Fit">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Internet tier</p>
                <p className="mt-1 text-lg font-semibold capitalize text-navy">{longStay.internetTier}</p>
              </div>
              <span className="text-3xl font-semibold text-navy">{report.internetFitScore}</span>
            </div>
            <p className="text-sm leading-7 text-navy-muted">{longStay.internetNote}</p>
          </div>
        </SectionCard>

        {/* Housing pressure */}
        <SectionCard icon={<Home className="h-5 w-5" />} title="Housing Pressure">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Market pressure</p>
                <p className="mt-1 text-lg font-semibold capitalize text-navy">{longStay.housingPressure}</p>
              </div>
              <span className="text-3xl font-semibold text-navy">{report.housingFitScore}</span>
            </div>
            <p className="text-sm leading-7 text-navy-muted">{longStay.housingNote}</p>
          </div>
        </SectionCard>

        {/* Healthcare */}
        <SectionCard icon={<HeartPulse className="h-5 w-5" />} title="Healthcare / Insurance Readiness">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Healthcare tier</p>
                <p className="mt-1 text-lg font-semibold capitalize text-navy">{longStay.healthcareReadiness}</p>
              </div>
              <span className="text-3xl font-semibold text-navy">{report.healthcareFitScore}</span>
            </div>
            <p className="text-sm leading-7 text-navy-muted">{longStay.healthcareNote}</p>
          </div>
        </SectionCard>

        {/* Transport */}
        <SectionCard icon={<Bus className="h-5 w-5" />} title="Local Transport Fit">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Transport tier</p>
                <p className="mt-1 text-lg font-semibold capitalize text-navy">{longStay.transportFit.replace('-', ' ')}</p>
              </div>
              <span className="text-3xl font-semibold text-navy">{report.transportFitScore}</span>
            </div>
            <p className="text-sm leading-7 text-navy-muted">{longStay.transportNote}</p>
          </div>
        </SectionCard>

        {/* Currency & cost volatility */}
        <SectionCard icon={<DollarSign className="h-5 w-5" />} title="Currency / Cost Volatility">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Currency note</p>
              <p className="mt-1.5 text-sm leading-7 text-navy-muted">{longStay.currencyVolatilityNote}</p>
            </div>
            <div className="border-t border-white/60 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Cost volatility</p>
              <p className="mt-1.5 text-sm leading-7 text-navy-muted">{longStay.costVolatilityNote}</p>
            </div>
          </div>
        </SectionCard>

        {/* Safety signals */}
        <SectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Safety & Stability Signals">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Risk level</p>
                <p className="mt-1 text-lg font-semibold capitalize text-navy">{longStay.longStayRiskLevel}</p>
              </div>
              <span className="text-3xl font-semibold text-navy">{report.safetyFitScore}</span>
            </div>
            <p className="text-sm leading-7 text-navy-muted">{destination.advisoryNote}</p>
          </div>
        </SectionCard>
      </div>

      {/* Caution notes */}
      {longStay.cautionNotes.length > 0 && (
        <section className="glass-card rounded-[1.75rem] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 shadow-soft">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-navy">Watch Points for This Stay</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {longStay.cautionNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 text-sm text-amber-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Long-stay checklist */}
      <section className="glass-card rounded-[1.75rem] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-navy shadow-soft">
            <CheckSquare className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-navy">Long-Stay Preparation Checklist</h3>
        </div>
        <ul className="mt-4 space-y-2">
          {longStay.checklistItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-white/70 px-4 py-3 text-sm text-navy-muted">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-accent/40 bg-sky-50 text-sky-accent">
                <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-white/60 bg-white/60 px-5 py-4 text-xs leading-6 text-navy-muted">
        <span className="font-semibold text-navy">Planning snapshot only.</span> Rules and local conditions can change. Verify visa, entry, tax, and insurance requirements with official sources before booking. Cost estimates are static and do not reflect real-time market data.
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const defaultInputs: StayPlannerInputs = {
  destinationId: '',
  stayLength: 30,
  budgetRange: '3k-4k',
  workStyle: 'remote',
  internetImportance: 'high',
  housingPreference: 'balanced',
  riskTolerance: 'medium',
};

const StayPlanner = () => {
  const { isAuthenticated } = useAuth();
  const {
    stayPlans,
    loading: loadingStayPlans,
    saving,
    error: stayPlanError,
    saveMessage,
    limitWarning,
    stayPlanLimit,
    saveStayPlan,
    removeStayPlan,
  } = useStayPlans();
  const [inputs, setInputs] = useState<StayPlannerInputs>(defaultInputs);
  const [report, setReport] = useState<StayFeasibilityReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = useCallback(<K extends keyof StayPlannerInputs>(key: K, value: StayPlannerInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setReport(null);
    setError(null);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!inputs.destinationId) {
      setError('Please select a destination to continue.');
      return;
    }
    const destination = destinations.find((d) => d.id === inputs.destinationId);
    if (!destination) {
      setError('Destination not found.');
      return;
    }
    const longStay = getLongStayData(inputs.destinationId);
    if (!longStay) {
      setError('Long-stay data is not available for this destination yet.');
      return;
    }
    setGenerating(true);
    setError(null);
    // Simulate brief load for UX
    setTimeout(() => {
      setReport(computeFeasibilityReport(destination, longStay, inputs));
      setGenerating(false);
    }, 480);
  }, [inputs]);

  const destinationOptions = destinations.map((d) => ({ value: d.id, label: `${d.city}, ${d.country}` }));

  const formatPlanDate = (value: string) => {
    const parsed = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) {
      return 'Unknown date';
    }

    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">30–90 Day Stay Planner</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
          Long-Stay Feasibility Planner
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-navy-muted">
          Assess whether a destination is realistic for a 30, 60, or 90-day stay based on your budget, work style, and requirements. Designed for remote workers, business travelers, and relocation researchers.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-navy-muted">
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-navy shadow-soft">Not an itinerary planner</span>
          <span className="rounded-full bg-white/80 px-3 py-1">Static planning data · verify before booking</span>
          <span className="rounded-full bg-white/80 px-3 py-1">All 8 current destinations supported</span>
        </div>
      </section>

      {/* Form */}
      <section className="glass-card rounded-[2rem] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Planning Inputs</div>
        <h2 className="mt-3 text-2xl font-semibold text-navy">Configure your stay assessment</h2>
        <p className="mt-2 text-sm text-navy-muted">Fill in your preferences to generate a feasibility report.</p>

        <div className="mt-6 space-y-6">
          {/* Destination select */}
          <SelectField<string>
            label="Destination"
            value={inputs.destinationId}
            onChange={(v) => set('destinationId', v)}
            options={[{ value: '', label: 'Select a destination…' }, ...destinationOptions]}
          />

          {/* Stay length */}
          <PillGroup<StayLength>
            label="Stay length"
            value={inputs.stayLength}
            onChange={(v) => set('stayLength', v)}
            options={[
              { value: 30, label: '30 days' },
              { value: 60, label: '60 days' },
              { value: 90, label: '90 days' },
            ]}
          />

          {/* Budget */}
          <PillGroup<BudgetRange>
            label="Monthly budget range"
            value={inputs.budgetRange}
            onChange={(v) => set('budgetRange', v)}
            options={(Object.entries(budgetRangeLabels) as [BudgetRange, string][]).map(([value, label]) => ({ value, label }))}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Work style */}
            <SelectField<WorkStyle>
              label="Work style"
              value={inputs.workStyle}
              onChange={(v) => set('workStyle', v)}
              options={(Object.entries(workStyleLabels) as [WorkStyle, string][]).map(([value, label]) => ({ value, label }))}
            />

            {/* Internet importance */}
            <SelectField<InternetImportance>
              label="Internet importance"
              value={inputs.internetImportance}
              onChange={(v) => set('internetImportance', v)}
              options={(Object.entries(internetImportanceLabels) as [InternetImportance, string][]).map(([value, label]) => ({ value, label }))}
            />

            {/* Housing preference */}
            <SelectField<HousingPreference>
              label="Housing preference"
              value={inputs.housingPreference}
              onChange={(v) => set('housingPreference', v)}
              options={(Object.entries(housingPreferenceLabels) as [HousingPreference, string][]).map(([value, label]) => ({ value, label }))}
            />

            {/* Risk tolerance */}
            <SelectField<RiskTolerance>
              label="Risk tolerance"
              value={inputs.riskTolerance}
              onChange={(v) => set('riskTolerance', v)}
              options={(Object.entries(riskToleranceLabels) as [RiskTolerance, string][]).map(([value, label]) => ({ value, label }))}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-sm disabled:opacity-60"
          >
            {generating ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating report…
              </>
            ) : (
              <>
                Generate Feasibility Report
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
          {report && (
            <button
              type="button"
              onClick={() => { setReport(null); setInputs(defaultInputs); }}
              className="btn-secondary px-5 py-3 text-sm"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      {/* Empty state */}
      {!report && !generating && (
        <section className="glass-card rounded-[1.75rem] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-sky-accent">
            <CalendarDays className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-navy">Your feasibility report will appear here</h2>
          <p className="mt-3 text-sm leading-7 text-navy-muted">
            Select a destination and configure your planning preferences above, then generate your report.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-navy-muted">
            {['Cost estimate', 'Visa snapshot', 'Internet fit', 'Housing pressure', 'Safety signals', 'Stay checklist'].map((label) => (
              <span key={label} className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 font-medium text-navy shadow-soft">
                {label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Report */}
      {report && (
        <div className="space-y-5">
          <FeasibilityReport report={report} />

          <section className="glass-card rounded-[1.75rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Save this plan</div>
                <h3 className="mt-2 text-lg font-semibold text-navy">Save stay plan for later</h3>
                <p className="mt-2 text-sm text-navy-muted">
                  Save this long-stay feasibility report to view it across devices.
                </p>
              </div>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => void saveStayPlan(report)}
                  disabled={saving}
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save stay plan'}
                </button>
              ) : (
                <Link to="/login" className="btn-secondary px-5 py-2.5 text-sm">
                  Log in to save
                </Link>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="mt-4 rounded-2xl border border-sky-accent/20 bg-sky-50/70 px-4 py-3 text-sm text-navy-muted">
                Log in to save this stay plan across devices.
              </div>
            ) : null}

            {saveMessage ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {saveMessage}
              </div>
            ) : null}

            {limitWarning ? (
              <div className="mt-4 rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
                {limitWarning}
              </div>
            ) : null}

            {stayPlanError ? (
              <div className="mt-4 rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
                {stayPlanError}
              </div>
            ) : null}

            {isAuthenticated ? (
              <p className="mt-4 text-xs text-navy-muted">Saved stay plans: {stayPlans.length}/{stayPlanLimit}</p>
            ) : null}
          </section>
        </div>
      )}

      <section className="glass-card rounded-[1.75rem] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Saved stay plans</div>
            <h2 className="mt-3 text-2xl font-semibold text-navy">Latest saved stay plans</h2>
            <p className="mt-2 text-sm text-navy-muted">
              Reopen your saved long-stay feasibility snapshots anytime.
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-2xl border border-sky-accent/20 bg-sky-50/70 px-4 py-3 text-sm text-navy-muted">
            Log in to save this stay plan across devices.
          </div>
        ) : loadingStayPlans ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy-muted">
            Loading saved stay plans...
          </div>
        ) : stayPlans.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy-muted">
            No saved stay plans yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stayPlans.map((plan) => (
              <article key={plan.id} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-accent">{plan.country}</p>
                    <h3 className="mt-1.5 text-lg font-semibold text-navy">{plan.destination_name}</h3>
                    <p className="mt-1 text-xs text-navy-muted">Saved {formatPlanDate(plan.created_at)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeStayPlan(plan.id)}
                    className="rounded-xl border border-white/70 bg-white px-2.5 py-2 text-navy-muted transition hover:text-navy"
                    aria-label="Remove saved stay plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                    <span className="text-navy-muted">Stay length</span>
                    <span className="font-semibold text-navy">{plan.stay_length_days} days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                    <span className="text-navy-muted">Score</span>
                    <span className="font-semibold text-navy">{plan.feasibility_score}/100</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                    <span className="text-navy-muted">Recommendation</span>
                    <span className="font-semibold capitalize text-navy">{plan.recommendation.replace(/-/g, ' ')}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StayPlanner;
