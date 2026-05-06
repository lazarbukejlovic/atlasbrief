import { Shield, Clock, Info } from 'lucide-react';

interface SourceFreshnessProps {
  lastChecked: string;
  sourceHierarchy: string;
  sourceConfidence: number;
  advisoryNote: string;
}

export default function SourceFreshnessPanel({
  lastChecked,
  sourceHierarchy,
  sourceConfidence,
  advisoryNote,
}: SourceFreshnessProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const confidencePercent = Math.round(sourceConfidence * 100);
  const confidenceLabel = sourceConfidence >= 0.9 ? 'High' : sourceConfidence >= 0.8 ? 'Moderate' : 'Informational';

  return (
    <section className="mt-8 glass-card rounded-[1.75rem] p-6">
      <h2 className="section-title mb-3 flex items-center gap-2">
        <Shield className="w-5 h-5 text-sand" />
        Source & Freshness
      </h2>

      <div className="space-y-3">
        {/* Last Checked */}
        <div className="card-base p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Last Checked</p>
            <p className="text-sm text-navy font-semibold">{formatDate(lastChecked)}</p>
          </div>
        </div>

        {/* Source Hierarchy */}
        <div className="card-base p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Information Sources</p>
          <p className="text-sm text-gray-700 italic">{sourceHierarchy}</p>
          <p className="text-xs text-gray-500 mt-2">Demo intelligence is shown today with simulated readiness data. An official-source-first structure is planned for future releases.</p>
        </div>

        {/* Confidence */}
        <div className="card-base p-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Confidence Level</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-sky-accent h-2 rounded-full transition-all"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-navy">{confidenceLabel}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Based on source recency within the current simulated dataset.</p>
        </div>

        {/* Disclaimer */}
        <div className="card-base p-4 bg-amber-50 border-l-4 border-amber-400">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Important Disclaimer</p>
              <p className="text-sm text-amber-800">{advisoryNote}</p>
              <p className="text-xs text-amber-700 mt-2">
                AtlasBrief provides a travel-readiness summary, not official legal or immigration advice. Requirements and advisories can change quickly. Always verify current requirements with official sources before booking or traveling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
