import { ArrowRight, Wallet, CheckCircle2, TrendingUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAtlasBrief } from '../components/AppLayout';
import CostIndexChart from '../components/CostIndexChart';
import DashboardCard from '../components/DashboardCard';
import DestinationCard from '../components/DestinationCard';
import HeroPlaneAnimation from '../components/HeroPlaneAnimation';
import ReadinessScore from '../components/ReadinessScore';
import { featuredDestinations, getDestinationReadinessScore } from '../data/destinations';

const Home = () => {
  const { isSaved, toggleSaved } = useAtlasBrief();
  const averageReadiness = Math.round(
    featuredDestinations.reduce(
      (sum, destination) => sum + getDestinationReadinessScore(destination),
      0
    ) / featuredDestinations.length
  );

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-sky-accent/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-accent shadow-soft">
              Trip Readiness Assistant
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-navy md:text-7xl">
            Know the country <span className="text-gradient">before you land.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-navy-muted md:text-xl">
              AtlasBrief turns fragmented destination rules, costs, safety signals, and local context into a clear pre-trip readiness brief.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/destinations" className="btn-primary inline-flex items-center justify-center gap-2">
                Build a readiness brief
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/destinations" className="btn-secondary inline-flex items-center justify-center">
                Explore destinations
              </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
              <DashboardCard
                eyebrow="Decision Engine"
                title="Can I go?"
                value="Ready"
                detail="Check whether a destination is practical before you book."
                icon={<CheckCircle2 className="h-5 w-5" />}
              />
              <DashboardCard
                eyebrow="Cost Clarity"
                title="What will it cost?"
                value="Realistic"
                detail="Understand entry readiness, estimated cost, and local context."
                icon={<Wallet className="h-5 w-5" />}
              />
              <DashboardCard
                eyebrow="Change Monitor"
                title="What changed?"
                value="Tracked"
                detail="Monitor rule, safety, and cost changes since you last checked."
                icon={<TrendingUp className="h-5 w-5" />}
              />
          </div>
        </div>
        <HeroPlaneAnimation />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ReadinessScore value={averageReadiness} label="Portfolio readiness" />
        <div className="glass-card rounded-[1.75rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Why AtlasBrief</div>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Not an itinerary planner. A decision engine.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
                'Check entry requirements, visa, and document readiness before booking.',
                'Compare realistic monthly costs and budget bands across destinations.',
                'Understand safety signals, local rules, and what actually affects your trip.',
                'Save destinations and track changes in rules, safety, and costs.',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white/75 p-4 text-sm leading-7 text-navy-muted">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-sky-soft/80 p-4 text-sm text-navy">
              <Lock className="h-5 w-5 text-sky-accent" />
              Built with trust and freshness: updated data, clear sources, conservative claims.
          </div>
        </div>
      </section>

      <CostIndexChart destinations={featuredDestinations} />

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Featured briefs</div>
              <h2 className="mt-3 text-3xl font-semibold text-navy">Compare destinations before you decide</h2>
          </div>
            <Link to="/destinations" className="hidden text-sm font-semibold text-navy hover:text-sky-accent sm:inline-flex">
              View all destinations
            </Link>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {featuredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isSaved={isSaved(destination.id)}
              onToggleSaved={toggleSaved}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;