export type UpdateSeverity = 'info' | 'watch' | 'important';

export interface TravelIntelligenceUpdate {
  id: string;
  destinationId: string;
  destinationName: string;
  changeType: string;
  message: string;
  date: string;
  severity: UpdateSeverity;
}

const updates: TravelIntelligenceUpdate[] = [
  {
    id: 'lisbon-requirements-review',
    destinationId: 'lisbon-portugal',
    destinationName: 'Lisbon',
    changeType: 'Requirements',
    message: 'Entry requirement snapshot reviewed.',
    date: '2026-05-02T09:10:00Z',
    severity: 'info',
  },
  {
    id: 'lisbon-currency-refresh',
    destinationId: 'lisbon-portugal',
    destinationName: 'Lisbon',
    changeType: 'FX',
    message: 'Currency note refreshed for current EUR direction.',
    date: '2026-05-02T08:30:00Z',
    severity: 'info',
  },
  {
    id: 'tokyo-cost-review',
    destinationId: 'tokyo-japan',
    destinationName: 'Tokyo',
    changeType: 'Cost',
    message: 'Long-stay estimate reviewed for current housing bands.',
    date: '2026-05-01T12:20:00Z',
    severity: 'info',
  },
  {
    id: 'tokyo-safety-steady',
    destinationId: 'tokyo-japan',
    destinationName: 'Tokyo',
    changeType: 'Safety',
    message: 'Safety signal unchanged in latest review cycle.',
    date: '2026-04-30T16:10:00Z',
    severity: 'info',
  },
  {
    id: 'dubai-requirements-review',
    destinationId: 'dubai-uae',
    destinationName: 'Dubai',
    changeType: 'Requirements',
    message: 'Entry requirement snapshot reviewed for 30/60 day windows.',
    date: '2026-04-27T10:00:00Z',
    severity: 'watch',
  },
  {
    id: 'barcelona-cost-higher',
    destinationId: 'barcelona-spain',
    destinationName: 'Barcelona',
    changeType: 'Cost',
    message: 'Cost band moved slightly higher in central neighborhoods.',
    date: '2026-04-23T17:00:00Z',
    severity: 'watch',
  },
  {
    id: 'mexico-city-currency-refresh',
    destinationId: 'mexico-city-mexico',
    destinationName: 'Mexico City',
    changeType: 'FX',
    message: 'Currency note refreshed after recent peso movement.',
    date: '2026-04-26T11:50:00Z',
    severity: 'watch',
  },
  {
    id: 'cape-town-review-needed',
    destinationId: 'cape-town-south-africa',
    destinationName: 'Cape Town',
    changeType: 'Freshness',
    message: 'Long-stay estimate reviewed, full advisory refresh due soon.',
    date: '2026-04-19T09:30:00Z',
    severity: 'important',
  },
  {
    id: 'medellin-safety-steady',
    destinationId: 'medellin-colombia',
    destinationName: 'Medellin',
    changeType: 'Safety',
    message: 'Safety signal unchanged in latest static review.',
    date: '2026-04-18T10:20:00Z',
    severity: 'watch',
  },
  {
    id: 'singapore-requirements-review',
    destinationId: 'singapore-singapore',
    destinationName: 'Singapore',
    changeType: 'Requirements',
    message: 'Entry requirement snapshot reviewed.',
    date: '2026-05-03T07:40:00Z',
    severity: 'info',
  },
];

export const getDestinationUpdates = (destinationId: string, limit = 3): TravelIntelligenceUpdate[] =>
  updates
    .filter((item) => item.destinationId === destinationId)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, limit);

export const getRecentIntelligenceUpdates = (destinationIds: string[], limit = 5): TravelIntelligenceUpdate[] => {
  const destinationSet = new Set(destinationIds);

  return updates
    .filter((item) => destinationSet.has(item.destinationId))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, limit);
};
