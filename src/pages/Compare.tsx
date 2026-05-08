import { AlertTriangle, CheckCircle, ChevronDown, Globe2, Info, Layers, RefreshCw, Shield, Star, Wifi, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FreshnessBadge from '../components/FreshnessBadge';
import SeoMeta from '../components/SeoMeta';
import TripNextStepPanel from '../components/TripNextStepPanel';
import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { destinations as allDestinations } from '../data/destinations';
import { useTravelerProfile } from '../hooks/useTravelerProfile';
import { getWatchlistSignal } from '../data/watchlistSignals';
import {
  type CompareMode,
  type CompareResult,
  type DestinationCompareScore,
  compareModeDescriptions,
  compareModeLabels,
  runComparison,
} from '../lib/compareEngine';

const MAX_DESTINATIONS = 3;
const MIN_DESTINATIONS = 2;

const modeOptions: { value: CompareMode; label: string; description: string }[] = [
  { value: 'tourist', label: 'Tourist Trip', description: 'Safety, transport, entry friction, short-trip cost' },
  { value: 'remote-work', label: 'Remote Work', description: 'Internet, cost, housing, work infrastructure' },
  { value: 'business', label: 'Business Travel', description: 'Transit, infrastructure, safety, planning confidence' },
  { value: 'long-stay', label: '30–90 Day Stay', description: 'Monthly cost, visa, housing pressure, healthcare' },
];

const insightIconMap = {
  winner: <Star className="h-4 w-4 text-sand" />,
  value: <Globe2 className="h-4 w-4 text-sky-accent" />,
  remote: <Wifi className="h-4 w-4 text-sky-accent" />,
  friction: <Zap className="h-4 w-4 text-emerald-600" />,
  caution: <AlertTriangle className="h-4 w-4 text-amber-600" />,
};

const insightBgMap = {
  winner: 'border-sand/40 bg-amber-50/60',
  value: 'border-sky-accent/20 bg-sky-50/60',
  remote: 'border-sky-accent/20 bg-sky-50/60',
  friction: 'border-emerald-200 bg-emerald-50/50',
  caution: 'border-amber-200 bg-amber-50/50',
};

function ScoreBar({ value, colorClass = 'bg-sky-accent' }: { value: number; colorClass?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

function ScoreCell({ value, colorClass }: { value: number; colorClass?: string }) {
  const color =
    colorClass ??
    (value >= 80 ? 'bg-emerald-400' : value >= 65 ? 'bg-sky-accent' : value >= 50 ? 'bg-amber-400' : 'bg-rose-400');
  return (
    <div className="space-y-1">
      <div className="text-sm font-semibold text-navy">{value}</div>
      <ScoreBar value={value} colorClass={color} />
    </div>
  );
}

const tableRows: { label: string; key: keyof DestinationCompareScore; icon: React.ReactNode }[] = [
  { label: 'Overall score', key: 'overallScore', icon: <Star className="h-3.5 w-3.5" /> },
  { label: 'Readiness', key: 'readinessScore', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  { label: 'Safety', key: 'safetyScore', icon: <Shield className="h-3.5 w-3.5" /> },
  { label: 'Internet', key: 'internetScore', icon: <Wifi className="h-3.5 w-3.5" /> },
  { label: 'Transport', key: 'transportScore', icon: <Zap className="h-3.5 w-3.5" /> },
  { label: 'Trust score', key: 'trustScore', icon: <RefreshCw className="h-3.5 w-3.5" /> },
  { label: 'Visa ease', key: 'visaScore', icon: <Globe2 className="h-3.5 w-3.5" /> },
  { label: 'Housing access', key: 'housingScore', icon: <Layers className="h-3.5 w-3.5" /> },
  { label: 'Healthcare', key: 'healthcareScore', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  { label: 'Freshness', key: 'freshnessScore', icon: <RefreshCw className="h-3.5 w-3.5" /> },
];

// Destination card picker
function DestinationPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < MAX_DESTINATIONS) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {allDestinations.map((d) => {
        const isSelected = selected.includes(d.id);
        const isDisabled = !isSelected && selected.length >= MAX_DESTINATIONS;
        return (
          <button
            key={d.id}
            type="button"
            disabled={isDisabled}
            onClick={() => toggle(d.id)}
            className={`relative rounded-2xl border p-4 text-left transition ${
              isSelected
                ? 'border-sky-accent bg-sky-50 shadow-card'
                : isDisabled
                  ? 'cursor-not-allowed border-white/50 bg-white/40 opacity-50'
                  : 'border-white/70 bg-white/80 hover:border-sky-accent/40 hover:bg-white shadow-soft'
            }`}
          >
            {isSelected && (
              <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-sky-accent">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-accent">{d.region}</p>
            <p className="mt-1 text-base font-semibold text-navy">{d.city}</p>
            <p className="text-xs text-navy-muted">{d.country}</p>
            <p className="mt-2 text-xs text-navy-muted">{d.costLevel} · {d.budgetBand}</p>
          </button>
        );
      })}
    </div>
  );
}

// Mode selector
function ModePicker({
  selected,
  onChange,
}: {
  selected: CompareMode;
  onChange: (mode: CompareMode) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {modeOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-2xl border p-4 text-left transition ${
            selected === opt.value
              ? 'border-sky-accent bg-sky-50 shadow-card'
              : 'border-white/70 bg-white/80 hover:border-sky-accent/40 hover:bg-white shadow-soft'
          }`}
        >
          <p className="text-sm font-semibold text-navy">{opt.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-navy-muted">{opt.description}</p>
        </button>
      ))}
    </div>
  );
}

// Best match summary card
function BestMatchCard({
  result,
  mode,
  emphasize,
}: {
  result: CompareResult;
  mode: CompareMode;
  emphasize: {
    value: boolean;
    remote: boolean;
    caution: boolean;
  };
}) {
  const best = result.bestMatch;
  const trust = getDestinationTrustMetadata(best.destination.id);

  return (
    <div className="glass-card rounded-[1.75rem] border border-sand/40 p-6 md:p-8">
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Best Overall Match</div>
          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            {best.destination.city}
            <span className="ml-2 text-base font-normal text-navy-muted">{best.destination.country}</span>
          </h2>
          <p className="mt-2 text-sm text-navy-muted">{compareModeDescriptions[mode]}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {trust && <FreshnessBadge freshnessStatus={trust.freshnessStatus} compact />}
            <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-navy shadow-soft">
              Score: {best.overallScore}/100
            </span>
            <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-navy shadow-soft">
              {best.costBand}
            </span>
          </div>

          <ul className="mt-4 space-y-1">
            {best.topStrengths.map((strength) => (
              <li key={strength} className="flex items-center gap-2 text-sm text-navy-muted">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid min-w-[200px] gap-3 sm:grid-cols-2">
          <div className={`rounded-2xl border bg-white/80 p-4 shadow-soft ${emphasize.value ? 'border-sky-accent/50 ring-1 ring-sky-accent/30' : 'border-white/70'}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Best value</p>
            <p className="mt-1 text-lg font-bold text-navy">{result.bestValue.destination.city}</p>
            <p className="mt-0.5 text-xs text-navy-muted">{result.bestValue.costBand}</p>
          </div>
          <div className={`rounded-2xl border bg-white/80 p-4 shadow-soft ${emphasize.remote ? 'border-sky-accent/50 ring-1 ring-sky-accent/30' : 'border-white/70'}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Best remote work</p>
            <p className="mt-1 text-lg font-bold text-navy">{result.bestRemoteWork.destination.city}</p>
            <p className="mt-0.5 text-xs text-navy-muted">Internet: {result.bestRemoteWork.internetScore}/100</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">Lowest friction</p>
            <p className="mt-1 text-lg font-bold text-navy">{result.lowestFriction.destination.city}</p>
            <p className="mt-0.5 text-xs text-navy-muted capitalize">{result.lowestFriction.longStay.visaComplexity} visa</p>
          </div>
          <div className={`rounded-2xl border bg-amber-50/60 p-4 shadow-soft ${emphasize.caution ? 'border-amber-400 ring-1 ring-amber-300' : 'border-amber-200'}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Watch carefully</p>
            <p className="mt-1 text-lg font-bold text-navy">{result.watchCarefully.destination.city}</p>
            <p className="mt-0.5 text-xs text-amber-700">Trust: {result.watchCarefully.trustScore}/100</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Per-destination score cards (stacked on mobile)
function DestinationScoreCard({ score, rank }: { score: DestinationCompareScore; rank: number }) {
  const trust = getDestinationTrustMetadata(score.destination.id);

  return (
    <div className="glass-card rounded-[1.75rem] border border-white/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {rank === 1 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand text-xs font-bold text-white">
                #1
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-accent">{score.destination.country}</p>
          </div>
          <h3 className="mt-1 text-2xl font-bold text-navy">{score.destination.city}</h3>
          <p className="mt-0.5 text-sm text-navy-muted">{score.destination.region}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-accent/20 bg-sky-soft text-xl font-bold text-navy shadow-soft">
            {score.overallScore}
          </div>
          {trust && <FreshnessBadge freshnessStatus={trust.freshnessStatus} compact />}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-semibold text-navy-muted">Safety</p>
          <ScoreCell value={score.safetyScore} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-navy-muted">Internet</p>
          <ScoreCell value={score.internetScore} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-navy-muted">Transport</p>
          <ScoreCell value={score.transportScore} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-navy-muted">Trust</p>
          <ScoreCell value={score.trustScore} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-accent">Monthly cost</p>
        <p className="text-lg font-bold text-navy">${score.monthlyCost.toLocaleString()}<span className="text-sm font-normal text-navy-muted">/mo</span></p>
        <p className="mt-0.5 text-xs text-navy-muted">{score.costBand}</p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-accent">Top strengths</p>
        <ul className="space-y-1.5">
          {score.topStrengths.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-navy-muted">
              <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">{score.mainCaution}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/destinations/${score.destination.id}`}
          className="rounded-2xl border border-sky-accent/20 bg-white px-3 py-1.5 text-xs font-semibold text-sky-accent shadow-soft transition hover:bg-sky-soft"
        >
          View full brief
        </Link>
        <Link
          to={`/stay-planner?dest=${score.destination.id}`}
          className="rounded-2xl border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-navy shadow-soft transition hover:bg-white"
        >
          Plan a stay
        </Link>
      </div>
    </div>
  );
}

// Comparison table (desktop)
function ComparisonTable({ scores }: { scores: DestinationCompareScore[] }) {
  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-white/60 bg-white/80 shadow-card">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-white/70 bg-sky-soft/60">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-navy-muted">
              Criteria
            </th>
            {scores.map((s) => (
              <th key={s.destination.id} className="px-5 py-4 text-left">
                <p className="text-sm font-bold text-navy">{s.destination.city}</p>
                <p className="text-xs text-navy-muted">{s.destination.country}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, idx) => (
            <tr key={row.key} className={idx % 2 === 0 ? 'bg-white/50' : 'bg-white/30'}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2 text-xs font-medium text-navy-muted">
                  {row.icon}
                  {row.label}
                </div>
              </td>
              {scores.map((s) => (
                <td key={s.destination.id} className="px-5 py-3">
                  <ScoreCell value={s[row.key] as number} />
                </td>
              ))}
            </tr>
          ))}
          {/* Monthly cost row */}
          <tr className="bg-white/50">
            <td className="px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-navy-muted">
                <Globe2 className="h-3.5 w-3.5" />
                Monthly cost
              </div>
            </td>
            {scores.map((s) => (
              <td key={s.destination.id} className="px-5 py-3">
                <div className="text-sm font-semibold text-navy">${s.monthlyCost.toLocaleString()}</div>
                <div className="text-xs text-navy-muted">{s.costBand}</div>
              </td>
            ))}
          </tr>
          {/* Visa complexity row */}
          <tr className="bg-white/30">
            <td className="px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-navy-muted">
                <Info className="h-3.5 w-3.5" />
                Visa complexity
              </div>
            </td>
            {scores.map((s) => (
              <td key={s.destination.id} className="px-5 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    s.longStay.visaComplexity === 'simple'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.longStay.visaComplexity === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {s.longStay.visaComplexity}
                </span>
              </td>
            ))}
          </tr>
          {/* Freshness row */}
          <tr className="bg-white/50">
            <td className="px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-navy-muted">
                <RefreshCw className="h-3.5 w-3.5" />
                Freshness
              </div>
            </td>
            {scores.map((s) => {
              const trust = getDestinationTrustMetadata(s.destination.id);
              return (
                <td key={s.destination.id} className="px-5 py-3">
                  {trust ? <FreshnessBadge freshnessStatus={trust.freshnessStatus} compact /> : <span className="text-xs text-navy-muted">—</span>}
                </td>
              );
            })}
          </tr>
          {/* Last checked row */}
          <tr className="bg-white/30">
            <td className="px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-navy-muted">
                <RefreshCw className="h-3.5 w-3.5" />
                Last checked
              </div>
            </td>
            {scores.map((s) => {
              const trust = getDestinationTrustMetadata(s.destination.id);
              return (
                <td key={s.destination.id} className="px-5 py-3">
                  <span className="text-xs text-navy-muted">
                    {trust
                      ? new Date(trust.lastCheckedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </span>
                </td>
              );
            })}
          </tr>
          {/* Best for row */}
          <tr className="bg-white/50">
            <td className="px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-navy-muted">
                <Star className="h-3.5 w-3.5" />
                Best for
              </div>
            </td>
            {scores.map((s) => (
              <td key={s.destination.id} className="px-5 py-3">
                <div className="flex flex-wrap gap-1">
                  {s.destination.bestFor.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-sky-soft px-2 py-0.5 text-[11px] font-medium text-navy">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Decision insights
function DecisionInsights({ result }: { result: CompareResult }) {
  return (
    <div className="space-y-3">
      {result.insights.map((insight) => (
        <div
          key={`${insight.type}-${insight.destinationName}`}
          className={`flex items-start gap-4 rounded-2xl border p-4 ${insightBgMap[insight.type]}`}
        >
          <div className="mt-0.5 shrink-0">{insightIconMap[insight.type]}</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">{insight.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-navy">{insight.destinationName}</p>
            <p className="mt-1 text-sm text-navy-muted">{insight.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const Compare = () => {
  const { profile } = useTravelerProfile();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<CompareMode>('tourist');
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showTable, setShowTable] = useState(true);

  const canCompare = selectedIds.length >= MIN_DESTINATIONS;
  const activeWatchSignalCount = result
    ? result.scores.filter((score) => {
        const watchSignal = getWatchlistSignal(score.destination.id);
        const trust = getDestinationTrustMetadata(score.destination.id);

        return (
          watchSignal?.severity === 'Watch' ||
          watchSignal?.severity === 'Elevated' ||
          trust?.freshnessStatus === 'stale'
        );
      }).length
    : 0;

  const handleCompare = () => {
    const selected = allDestinations.filter((d) => selectedIds.includes(d.id));
    setResult(runComparison(selected, mode));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResult(null);
    setSelectedIds([]);
  };

  const profileWeightingLabel = [
    profile.budgetStyle === 'value-focused' ? 'value signal emphasized' : null,
    profile.remoteWorkImportance === 'high' ? 'remote-work fit emphasized' : null,
    profile.riskTolerance === 'cautious' ? 'watch and low-friction signals emphasized' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="space-y-8">
      <SeoMeta
        title="Compare Destinations | AtlasBrief"
        description="Compare destination readiness, cost posture, trust/freshness, and planning friction before booking your next trip."
        canonicalPath="/compare"
      />

      {/* Hero */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Decision Engine</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">
            Compare destinations before you commit.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
            Select 2–3 destinations and a travel mode. AtlasBrief scores each destination using weighted criteria and generates a plain-English decision summary.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-navy-muted">
            This is a planning decision tool, not booking or legal advice. Always verify requirements with official sources.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-navy-muted">
            <span className="font-semibold text-navy">Weighted by your profile:</span> {profileWeightingLabel || 'Base compare weighting active. Set preferences in Traveler Profile for personalized emphasis.'}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-navy-muted">
            Want public pre-trip context first? <Link to="/dossiers" className="font-semibold text-sky-accent">Browse destination dossiers</Link>.
          </p>
        </div>
        {result && (
          <button type="button" onClick={handleReset} className="btn-secondary inline-flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 text-sm">
            <RefreshCw className="h-4 w-4" />
            Start over
          </button>
        )}
      </section>

      {!result ? (
        <>
          {/* Step 1: Destination picker */}
          <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Step 1</div>
                <h2 className="mt-1 text-xl font-semibold text-navy">Select 2–3 destinations</h2>
                <p className="mt-1 text-sm text-navy-muted">
                  {selectedIds.length === 0
                    ? 'Pick at least 2 destinations to compare.'
                    : `${selectedIds.length} selected${selectedIds.length < MIN_DESTINATIONS ? ' — select at least one more' : selectedIds.length === MAX_DESTINATIONS ? ' (maximum)' : ' — you can add one more'}`}
                </p>
              </div>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-sm font-semibold text-navy-muted hover:text-navy"
                >
                  Clear
                </button>
              )}
            </div>
            <DestinationPicker selected={selectedIds} onChange={setSelectedIds} />
          </section>

          {/* Step 2: Mode picker */}
          <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6 md:p-8">
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Step 2</div>
              <h2 className="mt-1 text-xl font-semibold text-navy">Select comparison mode</h2>
              <p className="mt-1 text-sm text-navy-muted">This determines how criteria are weighted in the scoring engine.</p>
            </div>
            <ModePicker selected={mode} onChange={setMode} />
          </section>

          {/* CTA */}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-sky-accent/20 bg-white/80 p-6 shadow-card">
            <div>
              <p className="text-sm font-semibold text-navy">
                {canCompare
                  ? `Ready to compare ${selectedIds.length} destinations in ${compareModeLabels[mode]} mode.`
                  : `Select at least ${MIN_DESTINATIONS} destinations to run a comparison.`}
              </p>
              <p className="mt-0.5 text-xs text-navy-muted">{compareModeDescriptions[mode]}</p>
            </div>
            <button
              type="button"
              disabled={!canCompare}
              onClick={handleCompare}
              className={`btn-primary inline-flex items-center justify-center gap-2 px-7 py-3 text-sm ${!canCompare ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Layers className="h-4 w-4" />
              Run comparison
            </button>
          </section>

          <section className="rounded-[1.5rem] border border-sand/40 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-navy-muted">
                <span className="font-semibold text-navy">Compare history - Pro preview.</span> Current compare remains available; Pro will expand saved comparison history over time.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/dossiers" className="text-sm font-semibold text-navy hover:text-sky-accent">
                  Browse dossiers
                </Link>
                <Link to="/pro" className="text-sm font-semibold text-navy hover:text-sky-accent">
                  View Pro preview
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Results header */}
          <section className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-accent/20 bg-sky-soft px-3 py-1 text-xs font-semibold text-navy">
              {compareModeLabels[mode]}
            </span>
            <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-navy shadow-soft">
              {result.scores.length} destinations compared
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-sm font-semibold text-navy-muted hover:text-navy"
            >
              ← Change selection
            </button>
          </section>

          {/* Best match summary */}
          <BestMatchCard
            result={result}
            mode={mode}
            emphasize={{
              value: profile.budgetStyle === 'value-focused',
              remote: profile.remoteWorkImportance === 'high' || profile.tripPurpose === 'remote-work',
              caution: profile.riskTolerance === 'cautious',
            }}
          />

          {activeWatchSignalCount > 0 ? (
            <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-amber-900">
                  <span className="font-semibold">{activeWatchSignalCount} destination{activeWatchSignalCount > 1 ? 's have' : ' has'} active watch signals.</span>{' '}
                  Review alerts before treating the compare result as a booking decision.
                </p>
                <Link to="/alerts" className="text-sm font-semibold text-amber-900 hover:text-navy">
                  Open alerts
                </Link>
              </div>
            </section>
          ) : null}

          <TripNextStepPanel
            title="Check external availability after your decision"
            description="Once you choose a direction, compare external stays and flights before purchase."
            destinationId={result.bestMatch.destination.id}
            country={result.bestMatch.destination.country}
            categories={['stays', 'flights', 'insurance']}
            limit={2}
          />

          {/* Decision insights */}
          <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6 md:p-8">
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Decision Insights</div>
              <h2 className="mt-1 text-2xl font-semibold text-navy">Plain-English decision guide</h2>
              <p className="mt-1 text-sm text-navy-muted">Key signals derived from weighted scoring for the {compareModeLabels[mode].toLowerCase()} mode.</p>
            </div>
            <DecisionInsights result={result} />
          </section>

          {/* Per-destination cards (mobile) */}
          <section className="block lg:hidden">
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Destination Scores</div>
              <h2 className="mt-1 text-2xl font-semibold text-navy">Score breakdown by destination</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.scores.map((score, idx) => (
                <DestinationScoreCard key={score.destination.id} score={score} rank={idx + 1} />
              ))}
            </div>
          </section>

          {/* Comparison table (desktop) */}
          <section className="glass-card hidden rounded-[1.75rem] border border-sky-accent/20 p-6 md:p-8 lg:block">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Comparison Table</div>
                <h2 className="mt-1 text-2xl font-semibold text-navy">Side-by-side score breakdown</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTable((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-semibold text-navy-muted hover:text-navy"
              >
                {showTable ? 'Hide table' : 'Show table'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showTable ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showTable && <ComparisonTable scores={result.scores} />}
          </section>

          {/* Table also shown on mobile via separate block */}
          <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-4 lg:hidden">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Comparison Table</div>
                <h2 className="mt-1 text-lg font-semibold text-navy">Side-by-side scores</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTable((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-semibold text-navy-muted hover:text-navy"
              >
                {showTable ? 'Hide' : 'Show'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showTable ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showTable && <ComparisonTable scores={result.scores} />}
          </section>

          {/* Trust notice */}
          <section className="rounded-[1.75rem] border border-sky-accent/10 bg-sky-soft/50 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" />
              <p className="text-sm leading-relaxed text-navy-muted">
                <span className="font-semibold text-navy">Planning snapshot only.</span>{' '}
                AtlasBrief provides planning snapshots, not legal or immigration advice. Verify entry, visa, tax, insurance, and safety requirements with official sources before booking.
              </p>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-sand/40 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-navy-muted">
                <span className="font-semibold text-navy">Compare history - Pro preview.</span> Pro is planned to retain deeper compare history across decision cycles.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/dossiers" className="text-sm font-semibold text-navy hover:text-sky-accent">
                  Browse dossiers
                </Link>
                <Link to="/pro" className="text-sm font-semibold text-navy hover:text-sky-accent">
                  View Pro preview
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Persistent trust notice at bottom before results */}
      {!result && (
        <section className="rounded-[1.75rem] border border-sky-accent/10 bg-sky-soft/50 p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-accent" />
            <p className="text-sm leading-relaxed text-navy-muted">
              <span className="font-semibold text-navy">Planning snapshot only.</span>{' '}
              AtlasBrief provides planning snapshots, not legal or immigration advice. Verify entry, visa, tax, insurance, and safety requirements with official sources before booking.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Compare;
