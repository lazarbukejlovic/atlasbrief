import { ArrowUpRight } from 'lucide-react';
import type { PartnerOffer } from '../data/partnerOffers';
import { partnerCategoryLabels } from '../data/partnerOffers';
import { openTrackedPartnerRedirect } from '../utils/redirectTracking';
import RedirectClickBadge from './RedirectClickBadge';

interface PartnerCardProps {
  offer: PartnerOffer;
  destinationId?: string;
  compact?: boolean;
  onRedirect?: () => void;
}

const PartnerCard = ({ offer, destinationId, compact = false, onRedirect }: PartnerCardProps) => {
  const handleOpen = () => {
    openTrackedPartnerRedirect(offer, {
      destinationId,
      onTracked: onRedirect,
    });
  };

  return (
    <article className={`rounded-[1.25rem] border border-white/70 bg-white/85 ${compact ? 'p-4' : 'p-5'} shadow-soft`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="rounded-full bg-ivory px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-muted">
          {partnerCategoryLabels[offer.category]}
        </span>
        <RedirectClickBadge monetizationType={offer.monetizationType} />
      </div>

      <h3 className={`mt-3 font-semibold text-navy ${compact ? 'text-base' : 'text-lg'}`}>{offer.title}</h3>
      <p className={`mt-2 text-navy-muted ${compact ? 'text-xs leading-6' : 'text-sm leading-7'}`}>
        {offer.shortDescription}
      </p>

      <div className="mt-3 space-y-1.5">
        <p className="text-xs text-navy-muted">
          <span className="font-semibold text-navy">Best for:</span> {offer.bestFor}
        </p>
        <p className="text-xs text-navy-muted">
          <span className="font-semibold text-navy">Trust note:</span> {offer.trustNote}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-2 rounded-2xl bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-light"
        >
          {offer.ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <span className="text-[11px] text-navy-muted">External partner/tool</span>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-navy-muted">{offer.disclaimer}</p>
    </article>
  );
};

export default PartnerCard;