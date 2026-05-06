import { useAtlasBrief } from '../components/AppLayout';
import TripProfileCard from '../components/TripProfileCard';
import EmptyState from '../components/EmptyState';

const Saved = () => {
  const { destinations, savedIds } = useAtlasBrief();
  const savedDestinations = destinations.filter((destination) => savedIds.includes(destination.id));

  return (
    <div className="space-y-8">
      <section>
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Watchlist</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Destination Watchlist</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
          Monitor your saved readiness briefs. Track changes in rules, costs, safety, and readiness status.
        </p>
      </section>

      {savedDestinations.length === 0 ? (
        <EmptyState
          title="No saved destinations yet"
          description="Your watchlist is empty. Save a destination to monitor readiness, cost, safety, and rule changes before you book."
          actionLabel="Browse destinations"
          actionHref="/destinations"
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-2">
          {savedDestinations.map((destination) => (
            <TripProfileCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default Saved;