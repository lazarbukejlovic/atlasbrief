import { Heart, MapPinned, Calendar, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDestinationReadinessScore, type Destination } from '../data/destinations';
import ReadinessStatusBadge from './ReadinessStatusBadge';

interface DestinationCardProps {
  destination: Destination;
  isSaved: boolean;
  onToggleSaved: (destination: Destination) => Promise<void>;
}

const DestinationCard = ({ destination, isSaved, onToggleSaved }: DestinationCardProps) => {
  const readinessScore = getDestinationReadinessScore(destination);

  const formatLastChecked = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getWhyThisMatters = () => {
    if (destination.whatChanged.length > 0) {
      return destination.whatChanged[0];
    }

    if (destination.readinessStatus === 'Watch Closely') {
      return 'Conditions can shift quickly here, so reconfirm requirements before booking.';
    }

    if (destination.readinessStatus === 'Review') {
      return 'Most basics are in place, but there are meaningful details to validate before you commit.';
    }

    return 'Strong baseline readiness signals for a lower-friction trip setup.';
  };

  return (
    <article className="group glass-card relative overflow-hidden rounded-[1.75rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-r ${destination.heroGradient} opacity-90`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">
            {destination.region}
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-navy">{destination.city}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-navy-muted">
            <MapPinned className="h-4 w-4" />
            <span>{destination.country}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void onToggleSaved(destination)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
            isSaved
              ? 'border-transparent bg-navy text-white'
              : 'border-white/70 bg-white/75 text-navy hover:border-sky-accent/30'
          }`}
          aria-label={isSaved ? 'Remove from watchlist' : 'Save brief'}
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="relative mt-24 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <ReadinessStatusBadge status={destination.readinessStatus} size="sm" />
          <div className="inline-flex items-center gap-1 rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-navy">
            <Shield className="h-3.5 w-3.5 text-sky-accent" />
            Confidence {Math.round(destination.sourceConfidence * 100)}%
          </div>
        </div>
        <p className="text-sm leading-7 text-navy-muted">{destination.summary}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-navy-muted">Readiness</div>
            <div className="mt-2 text-2xl font-semibold text-navy">{readinessScore}</div>
          </div>
          <div className="rounded-2xl bg-white/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-navy-muted">Cost band</div>
            <div className="mt-2 text-lg font-semibold text-navy">{destination.budgetBand}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-sky-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Why this matters</p>
          <p className="mt-2 text-sm text-navy-muted">{getWhyThisMatters()}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-navy-muted">
          <Calendar className="h-4 w-4" />
          <span>Last checked {formatLastChecked(destination.lastChecked)}</span>
          <span className="rounded-full bg-white/80 px-2 py-0.5 font-medium text-navy">
            {destination.whatChanged.length} updates
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {destination.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge bg-sky-soft text-navy">{tag}</span>
          ))}
        </div>
        <Link to={`/destinations/${destination.id}`} className="inline-flex items-center justify-center rounded-2xl bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-light">
          Open destination brief
        </Link>
      </div>
    </article>
  );
};

export default DestinationCard;