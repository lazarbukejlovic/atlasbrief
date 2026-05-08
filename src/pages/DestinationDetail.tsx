import { ArrowLeft, Heart } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAtlasBrief } from '../components/AppLayout';
import BudgetBandCard from '../components/BudgetBandCard';
import CurrencyWatch from '../components/CurrencyWatch';
import DailyBriefCard from '../components/DailyBriefCard';
import LocalRulesCard from '../components/LocalRulesCard';
import RequirementSummary from '../components/RequirementSummary';
import SafetySignals from '../components/SafetySignals';
import TravelChecklist from '../components/TravelChecklist';
import TripReadinessBrief from '../components/TripReadinessBrief';
import WhatChangedPanel from '../components/WhatChangedPanel';
import SourceFreshnessPanel from '../components/SourceFreshnessPanel';
import LastCheckedPanel from '../components/LastCheckedPanel';
import SourceConfidenceCard from '../components/SourceConfidenceCard';
import DataFreshnessTimeline from '../components/DataFreshnessTimeline';
import WhatChangedCard from '../components/WhatChangedCard';
import TrustScoreCard from '../components/TrustScoreCard';
import SourcePolicyNotice from '../components/SourcePolicyNotice';
import { getDestinationTrustMetadata } from '../data/destinationTrust';
import { getDestinationUpdates } from '../data/travelIntelligenceUpdates';
import { getDestinationById } from '../data/destinations';
import { useAuth } from '../hooks/useAuth';

const DestinationDetail = () => {
  const { id } = useParams();
  const {
    isSaved,
    toggleSaved,
    limitMessage,
    isWatched,
    toggleWatchlist,
    watchlistLimitMessage,
  } = useAtlasBrief();
  const { isAuthenticated } = useAuth();

  if (!id) {
    return <Navigate to="/destinations" replace />;
  }

  const destination = getDestinationById(id);
  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const trustMetadata = getDestinationTrustMetadata(destination.id);
  const trustUpdates = getDestinationUpdates(destination.id, 4);

  const saved = isSaved(destination.id);
  const watched = isWatched(destination.id);

  return (
    <div className="space-y-10">
      <div className="pt-1">
        <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" />
          Back to all destinations
        </Link>
      </div>

      <TripReadinessBrief destination={destination} compact={false} />

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => void toggleSaved(destination)}
          className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition ${
            saved ? 'bg-navy text-white' : 'bg-sky-accent text-white shadow-card hover:shadow-card-hover'
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          {saved ? 'Remove saved brief' : 'Save brief'}
        </button>
        <button
          type="button"
          onClick={() => void toggleWatchlist(destination)}
          disabled={!isAuthenticated}
          className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition ${
            watched
              ? 'border border-sky-accent/20 bg-white text-navy shadow-soft'
              : 'border border-white/70 bg-white/80 text-navy shadow-soft hover:border-sky-accent/30'
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </button>
      </div>

      {watched ? (
        <div className="rounded-2xl border border-sky-accent/20 bg-sky-50/70 px-4 py-3 text-sm text-navy-muted">
          <span className="font-semibold text-navy">Watching</span> this destination for readiness, cost, safety, and local rule shifts.
        </div>
      ) : null}

      {!isAuthenticated ? (
        <div className="rounded-2xl border border-sky-accent/20 bg-white/80 px-4 py-3 text-sm text-navy-muted">
          Sign in to monitor destination watchlist signals across devices.
        </div>
      ) : null}

      {limitMessage && !saved ? (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">{limitMessage}</p>
            <Link
              to="/pricing"
              className="inline-flex items-center rounded-xl bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-light"
            >
              View plans
            </Link>
          </div>
        </div>
      ) : null}

      {watchlistLimitMessage && !watched ? (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">{watchlistLimitMessage}</p>
            <Link
              to="/pricing"
              className="inline-flex items-center rounded-xl bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-light"
            >
              View plans
            </Link>
          </div>
        </div>
      ) : null}

      <RequirementSummary
        requirementSummary={destination.requirementSummary}
        passportValidityNote={destination.passportValidityNote}
        visaSnapshot={destination.visaSnapshot}
        healthSnapshot={destination.healthSnapshot}
      />

      <BudgetBandCard
        budgetBand={destination.budgetBand}
        costLevel={destination.costLevel}
        monthlyCostEstimate={destination.monthlyCostEstimate}
      />

      <CurrencyWatch destination={destination} />

      <section className="mt-8 glass-card rounded-[1.75rem] p-6">
        <h2 className="section-title mb-3">Safety & Advisories</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          <SafetySignals score={destination.safetyScore} notes={destination.emergencyNotes} />
          <LocalRulesCard rules={destination.localRules} />
        </div>
      </section>

      <section className="mt-8 glass-card rounded-[1.75rem] p-6">
        <h2 className="section-title mb-3">Practical Information</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          <DailyBriefCard items={destination.dailyBrief} />
          <TravelChecklist items={destination.checklist} />
        </div>
      </section>

      <WhatChangedPanel whatChanged={destination.whatChanged} />

      {trustMetadata ? (
        <section className="mt-8 glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Trust & Freshness</div>
          <h2 className="mt-3 text-3xl font-semibold text-navy">Planning confidence for this destination</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <LastCheckedPanel metadata={trustMetadata} />
            <SourceConfidenceCard metadata={trustMetadata} />
            <TrustScoreCard metadata={trustMetadata} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <DataFreshnessTimeline metadata={trustMetadata} />
            <WhatChangedCard
              updates={trustUpdates}
              emptyMessage="No recent static changes were logged for this destination."
            />
          </div>

          <div className="mt-4">
            <SourcePolicyNotice />
          </div>
        </section>
      ) : null}

      <SourceFreshnessPanel
        lastChecked={destination.lastChecked}
        sourceHierarchy={destination.sourceHierarchy}
        sourceConfidence={destination.sourceConfidence}
        advisoryNote={destination.advisoryNote}
      />

      <section className="mt-8 glass-card rounded-[1.75rem] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Quick Reference</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Region</div>
            <div className="mt-2 text-base font-semibold text-navy">{destination.region}</div>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Language</div>
            <div className="mt-2 text-base font-semibold text-navy">{destination.language.split(',')[0]}</div>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Currency</div>
            <div className="mt-2 text-base font-semibold text-navy">{destination.currency}</div>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Internet Reliability</div>
            <div className="mt-2 text-base font-semibold text-navy">{destination.internetScore}%</div>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Transport Quality</div>
            <div className="mt-2 text-base font-semibold text-navy">{destination.transportScore}%</div>
          </div>
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-navy-muted">Safety Score</div>
            <div className="mt-2 text-base font-semibold text-navy">{destination.safetyScore}%</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinationDetail;
