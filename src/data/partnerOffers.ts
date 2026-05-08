export type PartnerCategory =
  | 'stays'
  | 'flights'
  | 'insurance'
  | 'visa-entry-help'
  | 'remote-work-tools'
  | 'local-transport';

export type MonetizationType = 'redirect' | 'future affiliate' | 'lead' | 'informational';

export interface PartnerOffer {
  id: string;
  category: PartnerCategory;
  title: string;
  shortDescription: string;
  bestFor: string;
  trustNote: string;
  destinationFit?: string[];
  relevantCountries?: string[];
  ctaLabel: string;
  externalUrl: string;
  monetizationType: MonetizationType;
  disclaimer: string;
}

export const partnerCategoryLabels: Record<PartnerCategory, string> = {
  stays: 'Stays',
  flights: 'Flights',
  insurance: 'Travel insurance',
  'visa-entry-help': 'Visa / entry help',
  'remote-work-tools': 'Remote work / long-stay tools',
  'local-transport': 'Local transport',
};

export const partnerOffers: PartnerOffer[] = [
  {
    id: 'stays-booking-global',
    category: 'stays',
    title: 'Global stay availability',
    shortDescription: 'Compare hotel and apartment availability externally after checking destination readiness.',
    bestFor: 'Short-to-medium stays with flexible location options.',
    trustNote: 'Use AtlasBrief cost and neighborhood signals first, then compare listings externally.',
    relevantCountries: ['Portugal', 'Japan', 'United Arab Emirates', 'Singapore', 'Spain', 'Mexico', 'South Africa', 'Colombia'],
    ctaLabel: 'Explore stay options',
    externalUrl: 'https://www.booking.com/',
    monetizationType: 'future affiliate',
    disclaimer: 'External booking platform. Availability and policies can change quickly.',
  },
  {
    id: 'stays-airbnb-flex',
    category: 'stays',
    title: 'Longer-stay accommodation search',
    shortDescription: 'Review month-long stays and filter by neighborhood before committing.',
    bestFor: '30-90 day planning and remote-work accommodation scouting.',
    trustNote: 'Use this as a comparison tool, not a substitute for lease or policy checks.',
    ctaLabel: 'Compare long-stay listings',
    externalUrl: 'https://www.airbnb.com/',
    monetizationType: 'redirect',
    disclaimer: 'External platform. Verify cancellation terms and local rental rules before purchase.',
  },
  {
    id: 'flights-skyscanner',
    category: 'flights',
    title: 'Flight options across carriers',
    shortDescription: 'Check current route options after reviewing readiness and alerts.',
    bestFor: 'Comparing outbound windows after choosing a destination shortlist.',
    trustNote: 'Always re-check final airline terms and baggage policies directly with carriers.',
    ctaLabel: 'Check flight availability',
    externalUrl: 'https://www.skyscanner.com/',
    monetizationType: 'future affiliate',
    disclaimer: 'External search tool. Prices and route availability can change rapidly.',
  },
  {
    id: 'flights-google-flights',
    category: 'flights',
    title: 'Flight price and timing explorer',
    shortDescription: 'Compare timing and pricing trends externally before selecting final dates.',
    bestFor: 'Users narrowing down travel windows after compare results.',
    trustNote: 'Use alongside destination safety and entry checks from AtlasBrief.',
    ctaLabel: 'Explore flight timing',
    externalUrl: 'https://www.google.com/travel/flights',
    monetizationType: 'informational',
    disclaimer: 'External tool. AtlasBrief does not control fare updates or ticketing terms.',
  },
  {
    id: 'insurance-worldnomads',
    category: 'insurance',
    title: 'Travel insurance quote starter',
    shortDescription: 'Review insurance plan options after finalizing destination readiness.',
    bestFor: 'Short and medium trips needing medical and interruption coverage research.',
    trustNote: 'Coverage details differ by policy and resident country; compare documents carefully.',
    ctaLabel: 'Review insurance options',
    externalUrl: 'https://www.worldnomads.com/',
    monetizationType: 'lead',
    disclaimer: 'External insurer marketplace. Verify eligibility, limits, and exclusions directly.',
  },
  {
    id: 'insurance-safetywing',
    category: 'insurance',
    title: 'Nomad-focused insurance options',
    shortDescription: 'Explore coverage options often used for remote work and longer stays.',
    bestFor: 'Remote workers and long-stay travelers researching ongoing coverage.',
    trustNote: 'Review policy wording and local healthcare access before purchasing coverage.',
    ctaLabel: 'Check nomad coverage',
    externalUrl: 'https://safetywing.com/',
    monetizationType: 'future affiliate',
    disclaimer: 'External insurance provider. AtlasBrief is not an insurance broker.',
  },
  {
    id: 'visa-timatic',
    category: 'visa-entry-help',
    title: 'Entry requirement reference check',
    shortDescription: 'Cross-check travel-document requirements before purchase decisions.',
    bestFor: 'Final validation of entry assumptions before booking flights or stays.',
    trustNote: 'Always prioritize embassy, consulate, or immigration authority updates.',
    ctaLabel: 'Review entry references',
    externalUrl: 'https://www.iatatravelcentre.com/',
    monetizationType: 'informational',
    disclaimer: 'External reference tool. Official government sources remain the final authority.',
  },
  {
    id: 'visa-sherpa',
    category: 'visa-entry-help',
    title: 'Visa and travel-document assistant',
    shortDescription: 'Explore visa and entry guidance tools to support planning.',
    bestFor: 'Travelers validating paperwork complexity after receiving watch or freshness alerts.',
    trustNote: 'Treat results as planning support and verify with official sources.',
    ctaLabel: 'Explore visa support tools',
    externalUrl: 'https://www.joinsherpa.com/',
    monetizationType: 'lead',
    disclaimer: 'External service. AtlasBrief does not issue visas or approvals.',
  },
  {
    id: 'remote-nomadlist',
    category: 'remote-work-tools',
    title: 'Remote work city benchmarking',
    shortDescription: 'Compare external remote-work metrics after AtlasBrief feasibility analysis.',
    bestFor: 'Long-stay and remote-work destination validation.',
    trustNote: 'Use as a secondary signal next to AtlasBrief trust and freshness context.',
    ctaLabel: 'Compare remote-work context',
    externalUrl: 'https://nomadlist.com/',
    monetizationType: 'redirect',
    disclaimer: 'External dataset and community tool. Validate critical details independently.',
  },
  {
    id: 'remote-wise-business',
    category: 'remote-work-tools',
    title: 'International payment and expense setup',
    shortDescription: 'Review options for handling multi-currency expenses during longer stays.',
    bestFor: 'Remote workers and business travelers managing cross-border spending.',
    trustNote: 'Compare fees, limits, and local support before opening financial products.',
    ctaLabel: 'Explore payment tools',
    externalUrl: 'https://wise.com/',
    monetizationType: 'future affiliate',
    disclaimer: 'External financial service. Terms and availability depend on your country.',
  },
  {
    id: 'transport-rome2rio',
    category: 'local-transport',
    title: 'Intercity and local transport planner',
    shortDescription: 'Estimate local transport options after destination selection.',
    bestFor: 'Understanding airport transfers and local mobility alternatives.',
    trustNote: 'Use this as a route preview, then verify with official operator schedules.',
    ctaLabel: 'Check transport options',
    externalUrl: 'https://www.rome2rio.com/',
    monetizationType: 'informational',
    disclaimer: 'External transport aggregation tool. Confirm schedules and fares before travel.',
  },
  {
    id: 'transport-transit-app',
    category: 'local-transport',
    title: 'Urban transit app directory',
    shortDescription: 'Find city transport app options for day-to-day movement planning.',
    bestFor: 'Travelers who depend on public transit once in destination.',
    trustNote: 'Always check local transport authority alerts for real-time disruptions.',
    ctaLabel: 'Explore transit tools',
    externalUrl: 'https://transitapp.com/',
    monetizationType: 'redirect',
    disclaimer: 'External app platform. Coverage and service vary by city.',
  },
];

export const getPartnerOffersByCategory = (category?: PartnerCategory): PartnerOffer[] => {
  if (!category) {
    return partnerOffers;
  }

  return partnerOffers.filter((offer) => offer.category === category);
};

interface PartnerContextOptions {
  destinationId?: string;
  country?: string;
  categories?: PartnerCategory[];
  limit?: number;
}

export const getPartnerOffersForContext = ({
  destinationId,
  country,
  categories,
  limit,
}: PartnerContextOptions): PartnerOffer[] => {
  const normalizedCountry = country?.toLowerCase();

  const filtered = partnerOffers.filter((offer) => {
    if (categories && categories.length > 0 && !categories.includes(offer.category)) {
      return false;
    }

    const destinationMatch = destinationId ? offer.destinationFit?.includes(destinationId) : false;
    const countryMatch = normalizedCountry
      ? offer.relevantCountries?.some((value) => value.toLowerCase() === normalizedCountry)
      : false;

    const hasSpecificScope = (offer.destinationFit?.length ?? 0) > 0 || (offer.relevantCountries?.length ?? 0) > 0;

    if (!hasSpecificScope) {
      return true;
    }

    return Boolean(destinationMatch || countryMatch);
  });

  if (!limit) {
    return filtered;
  }

  return filtered.slice(0, limit);
};