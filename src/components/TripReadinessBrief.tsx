import { Briefcase, AlertCircle, Zap } from 'lucide-react';
import { Destination } from '../data/destinations';
import ReadinessStatusBadge from './ReadinessStatusBadge';

interface TripReadinessBriefProps {
  destination: Destination;
  compact?: boolean;
}

export default function TripReadinessBrief({
  destination,
  compact = false,
}: TripReadinessBriefProps) {
  const readinessScore = Math.round(
    (destination.safetyScore + destination.internetScore + destination.transportScore) / 3
  );

  if (compact) {
    return (
      <div className="card-base p-4 bg-gradient-to-r from-blue-50/50 to-transparent">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <p className="text-sm font-medium text-gray-600">Readiness Status</p>
            <ReadinessStatusBadge status={destination.readinessStatus} size="sm" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Overall Score</p>
            <p className="text-lg font-bold text-navy">{readinessScore}%</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 italic mb-2">Last checked {new Date(destination.lastChecked).toLocaleDateString()}</p>
        <p className="text-sm text-gray-700">{destination.summary}</p>
      </div>
    );
  }

  return (
    <section className="mb-8 glass-card rounded-[1.75rem] p-6 md:p-8">
      <h1 className="text-3xl font-bold text-navy mb-2 flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-sky-accent" />
        Trip Readiness Brief
      </h1>
      <p className="text-sm text-navy-muted">Decision summary for can-I-go, expected cost, and what changed since your last check.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Readiness Status */}
        <div className="card-base p-5 bg-white/80">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Readiness Status</p>
          <ReadinessStatusBadge status={destination.readinessStatus} size="lg" />
          <p className="text-xs text-gray-600 mt-3">
            {destination.readinessStatus === 'Ready' && 'This destination is fully ready for travel with standard precautions.'}
            {destination.readinessStatus === 'Review' && 'Review specific sections before booking. Some factors require attention.'}
            {destination.readinessStatus === 'Watch Closely' && 'Assess these factors carefully. Additional planning may be needed.'}
          </p>
        </div>

        {/* Readiness Score */}
        <div className="card-base p-5 bg-white/80">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Overall Readiness</p>
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="44" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeDasharray={`${(readinessScore / 100) * 2 * 22 * Math.PI} ${2 * 22 * Math.PI}`}
                strokeLinecap="round"
              />
            </svg>
            <p className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-navy">{readinessScore}%</span>
            </p>
          </div>
          <p className="text-xs text-gray-600 text-center">Safety, internet, and transport combined.</p>
        </div>

        {/* Last Checked */}
        <div className="card-base p-5 bg-gradient-to-br from-blue-50 to-white">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Data Freshness</p>
          <p className="text-2xl font-bold text-navy mb-2">
            {new Date(destination.lastChecked).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-600">Last updated {destination.lastChecked}</p>
          <div className="mt-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-sand" />
            <span className="text-xs font-medium text-sand">
              {Math.round(destination.sourceConfidence * 100)}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card-base p-5 mt-5 bg-gradient-to-r from-ivory to-white border-l-4 border-sky-accent">
        <p className="text-gray-700 leading-relaxed">{destination.summary}</p>
      </div>

      {/* Advisory Banner */}
      {destination.readinessStatus !== 'Ready' && (
        <div className="card-base p-4 mt-5 bg-yellow-50 border-l-4 border-yellow-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-900 mb-1">Review Sections Before Booking</p>
            <p className="text-sm text-yellow-800">Pay attention to the specific sections below that may require additional planning.</p>
          </div>
        </div>
      )}
    </section>
  );
}
