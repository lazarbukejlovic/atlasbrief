import type { PartnerOffer } from '../data/partnerOffers';
import PartnerCard from './PartnerCard';

interface PartnerRedirectGridProps {
  offers: PartnerOffer[];
  destinationId?: string;
  compact?: boolean;
  onRedirect?: () => void;
}

const PartnerRedirectGrid = ({ offers, destinationId, compact = false, onRedirect }: PartnerRedirectGridProps) => {
  if (offers.length === 0) {
    return (
      <div className="rounded-[1.25rem] border border-white/70 bg-white/75 p-4 text-sm text-navy-muted">
        No partner tools match this filter yet.
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${compact ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
      {offers.map((offer) => (
        <PartnerCard
          key={offer.id}
          offer={offer}
          destinationId={destinationId}
          compact={compact}
          onRedirect={onRedirect}
        />
      ))}
    </div>
  );
};

export default PartnerRedirectGrid;