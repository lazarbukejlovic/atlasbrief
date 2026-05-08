import { getTrustScore, type DestinationTrustMetadata } from '../data/destinationTrust';

interface TrustScoreCardProps {
  metadata: DestinationTrustMetadata;
}

const TrustScoreCard = ({ metadata }: TrustScoreCardProps) => {
  const score = getTrustScore(metadata);

  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Trust score</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-navy">{score}</span>
        <span className="mb-1 text-sm text-navy-muted">/100</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-sky-accent" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-xs text-navy-muted">Calculated from freshness, source tier, and confidence level using static demo weights.</p>
    </div>
  );
};

export default TrustScoreCard;
