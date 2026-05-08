import { Link } from 'react-router-dom';
import type { PartnerCategory } from '../data/partnerOffers';
import { getPartnerOffersForContext } from '../data/partnerOffers';
import PartnerRedirectGrid from './PartnerRedirectGrid';

interface TripNextStepPanelProps {
  title?: string;
  description?: string;
  destinationId?: string;
  country?: string;
  categories?: PartnerCategory[];
  limit?: number;
}

const TripNextStepPanel = ({
  title = 'Useful external tools',
  description = 'After reviewing readiness, compare external options before you purchase.',
  destinationId,
  country,
  categories,
  limit = 3,
}: TripNextStepPanelProps) => {
  const offers = getPartnerOffersForContext({
    destinationId,
    country,
    categories,
    limit,
  });

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Next step</div>
          <h2 className="mt-2 text-2xl font-semibold text-navy">{title}</h2>
          <p className="mt-2 text-sm text-navy-muted">{description}</p>
        </div>
        <Link to="/partners" className="rounded-2xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-navy shadow-soft transition hover:bg-white/80">
          Explore all partners
        </Link>
      </div>

      <div className="mt-5">
        <PartnerRedirectGrid offers={offers} destinationId={destinationId} compact />
      </div>
    </section>
  );
};

export default TripNextStepPanel;