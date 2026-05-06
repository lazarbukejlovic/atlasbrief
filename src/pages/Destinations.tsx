import { useMemo, useState } from 'react';
import { useAtlasBrief } from '../components/AppLayout';
import DestinationCard from '../components/DestinationCard';

const Destinations = () => {
  const { destinations, isSaved, toggleSaved } = useAtlasBrief();
  const [regionFilter, setRegionFilter] = useState('All');
  const [labelFilter, setLabelFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');

  const regions = useMemo(
    () => ['All', ...new Set(destinations.map((destination) => destination.region))],
    [destinations]
  );

  const labelFilters = useMemo(
    () => [
      'All',
      'Best for remote work',
      'Budget friendly',
      'Business travel',
      'Watch closely',
      'High confidence',
    ],
    []
  );

  const costFilters = useMemo(() => ['All', 'Lean', 'Balanced', 'Premium'], []);

  const filteredDestinations = useMemo(
    () => {
      return destinations.filter((destination) => {
        const matchesRegion =
          regionFilter === 'All' || destination.region === regionFilter;

        const matchesLabel = (() => {
          if (labelFilter === 'All') {
            return true;
          }

          if (labelFilter === 'Best for remote work') {
            return destination.bestFor.some((item) =>
              item.toLowerCase().includes('remote')
            );
          }

          if (labelFilter === 'Budget friendly') {
            return destination.costLevel === 'Lean';
          }

          if (labelFilter === 'Business travel') {
            return destination.bestFor.some((item) =>
              item.toLowerCase().includes('business')
            );
          }

          if (labelFilter === 'Watch closely') {
            return destination.readinessStatus === 'Watch Closely';
          }

          if (labelFilter === 'High confidence') {
            return destination.sourceConfidence >= 0.9;
          }

          return true;
        })();

        const matchesCost =
          costFilter === 'All' || destination.costLevel === costFilter;

        return matchesRegion && matchesLabel && matchesCost;
      });
    },
    [costFilter, destinations, labelFilter, regionFilter]
  );

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Destinations</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Compare where the landing feels easiest</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
              Compare readiness signals across destinations to decide where you can go with confidence, what it will cost, and what changed since your last check.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {labelFilters.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setLabelFilter(label)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  labelFilter === label
                    ? 'bg-sky-accent text-white'
                    : 'bg-white text-navy-muted shadow-soft hover:text-navy'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {costFilters.map((cost) => (
            <button
              key={cost}
              type="button"
              onClick={() => setCostFilter(cost)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                costFilter === cost
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy-muted shadow-soft hover:text-navy'
              }`}
            >
              {cost === 'All' ? 'Cost level: All' : `Cost level: ${cost}`}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-muted">Region</span>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  regionFilter === region
                    ? 'bg-navy text-white'
                    : 'bg-white text-navy-muted shadow-soft hover:text-navy'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {filteredDestinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            isSaved={isSaved(destination.id)}
            onToggleSaved={toggleSaved}
          />
        ))}
      </section>
    </div>
  );
};

export default Destinations;