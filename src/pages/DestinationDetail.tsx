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
import { getDestinationById } from '../data/destinations';

const DestinationDetail = () => {
  const { id } = useParams();
  const { isSaved, toggleSaved } = useAtlasBrief();

  if (!id) {
    return <Navigate to="/destinations" replace />;
  }

  const destination = getDestinationById(id);
  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const saved = isSaved(destination.id);

  return (
    <div className="space-y-10">
      <div className="pt-1">
        <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" />
          Back to all destinations
        </Link>
      </div>

      <TripReadinessBrief destination={destination} compact={false} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => toggleSaved(destination.id)}
          className={`inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition ${
            saved ? 'bg-navy text-white' : 'bg-sky-accent text-white shadow-card hover:shadow-card-hover'
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          {saved ? 'Saved to watchlist' : 'Save to watchlist'}
        </button>
      </div>

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
