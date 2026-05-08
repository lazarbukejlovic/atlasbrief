import type { MonetizationType } from '../data/partnerOffers';

const monetizationLabelMap: Record<MonetizationType, string> = {
  redirect: 'External partner',
  'future affiliate': 'Future affiliate surface',
  lead: 'External lead handoff',
  informational: 'External reference tool',
};

interface RedirectClickBadgeProps {
  monetizationType: MonetizationType;
}

const RedirectClickBadge = ({ monetizationType }: RedirectClickBadgeProps) => (
  <span className="inline-flex rounded-full border border-sky-accent/20 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-accent">
    {monetizationLabelMap[monetizationType]}
  </span>
);

export default RedirectClickBadge;