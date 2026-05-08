import type { DestinationTrustMetadata } from '../data/destinationTrust';

interface SourceConfidenceCardProps {
  metadata: DestinationTrustMetadata;
}

const confidenceLabelMap = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const tierLabelMap = {
  official: 'Official',
  partner: 'Partner',
  estimated: 'Estimated',
  demo: 'Demo',
};

const confidenceWidthMap = {
  high: '92%',
  medium: '74%',
  low: '54%',
};

const SourceConfidenceCard = ({ metadata }: SourceConfidenceCardProps) => (
  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Source confidence</p>
    <div className="mt-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-navy-muted">Tier</p>
        <p className="text-base font-semibold text-navy">{tierLabelMap[metadata.sourceTier]}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-navy-muted">Confidence</p>
        <p className="text-base font-semibold text-navy">{confidenceLabelMap[metadata.confidenceLevel]}</p>
      </div>
    </div>

    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
      <div
        className="h-full rounded-full bg-sky-accent"
        style={{ width: confidenceWidthMap[metadata.confidenceLevel] }}
      />
    </div>

    <p className="mt-3 text-sm leading-7 text-navy-muted">{metadata.sourceSummary}</p>
    <ul className="mt-2 space-y-1 text-xs text-navy-muted">
      {metadata.sourceNotes.slice(0, 2).map((note) => (
        <li key={note}>- {note}</li>
      ))}
    </ul>
  </div>
);

export default SourceConfidenceCard;
