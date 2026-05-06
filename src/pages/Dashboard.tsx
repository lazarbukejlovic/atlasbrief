import { Bookmark, Globe2, PlaneTakeoff, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtlasBrief } from '../components/AppLayout';
import CostIndexChart from '../components/CostIndexChart';
import CurrencyWatch from '../components/CurrencyWatch';
import DashboardCard from '../components/DashboardCard';
import TripProfileCard from '../components/TripProfileCard';
import { getDestinationReadinessScore, destinations as allDestinations } from '../data/destinations';

const Dashboard = () => {
  const { destinations, savedIds } = useAtlasBrief();

  const savedDestinations = destinations.filter((destination) => savedIds.includes(destination.id));
  const strongestReadiness = [...destinations].sort(
    (left, right) => getDestinationReadinessScore(right) - getDestinationReadinessScore(left)
  )[0];
  const leanestDestination = [...destinations].sort(
    (left, right) => left.monthlyCostEstimate - right.monthlyCostEstimate
  )[0];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Trip Planning</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy md:text-5xl">Trip Readiness Workspace</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-navy-muted">
            Monitor your saved destinations, track readiness changes, and compare costs before you book. All updates are saved to your browser.
          </p>
        </div>
        <Link to="/destinations" className="btn-secondary inline-flex items-center justify-center lg:w-auto">
          Add more destinations
        </Link>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          eyebrow="Saved atlas"
          title="Tracked destinations"
          value={String(savedIds.length)}
          detail="Your watchlist updates automatically when you add or remove destinations."
          icon={<Bookmark className="h-5 w-5" />}
        />
        <DashboardCard
          eyebrow="Best readiness"
          title={strongestReadiness.city}
          value={`${getDestinationReadinessScore(strongestReadiness)}`}
          detail="Highest combined readiness score in the current destination set."
          icon={<Signal className="h-5 w-5" />}
        />
        <DashboardCard
          eyebrow="Best value"
          title={leanestDestination.city}
          value={`$${leanestDestination.monthlyCostEstimate.toLocaleString()}`}
          detail="Most budget-friendly option for extended monthly stays."
          icon={<Globe2 className="h-5 w-5" />}
        />
        <DashboardCard
          eyebrow="Travel mode"
          title="Business + remote"
          value="2 lanes"
          detail="Designed for business travelers and remote workers evaluating fit."
          icon={<PlaneTakeoff className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CostIndexChart destinations={destinations.slice(0, 6)} />
        <CurrencyWatch destination={strongestReadiness} />
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Watchlist</div>
              <h2 className="mt-3 text-3xl font-semibold text-navy">Saved readiness briefs</h2>
          </div>
          <Link to="/saved" className="text-sm font-semibold text-navy hover:text-sky-accent">
            Open saved page
          </Link>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {(savedDestinations.length > 0 ? savedDestinations : allDestinations.slice(0, 2)).map((destination) => (
            <TripProfileCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;