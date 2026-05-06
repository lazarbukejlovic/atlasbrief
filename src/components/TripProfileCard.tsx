import { MapPin, Shield, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { Destination } from '../data/destinations';
import { Link } from 'react-router-dom';
import ReadinessStatusBadge from './ReadinessStatusBadge';

interface TripProfileCardProps {
  destination: Destination;
}

export default function TripProfileCard({ destination }: TripProfileCardProps) {
  const readinessScore = Math.round(
    (destination.safetyScore + destination.internetScore + destination.transportScore) / 3
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Updated today';
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="card-base p-5 hover:shadow-card-hover transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-sky-accent" />
            <h3 className="text-lg font-bold text-navy group-hover:text-sky-accent transition-colors">
              {destination.city}, {destination.country}
            </h3>
          </div>
          <p className="text-sm text-gray-600 ml-7">{destination.summary.substring(0, 80)}...</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-sky-accent transition-colors flex-shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Readiness Status */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <ReadinessStatusBadge status={destination.readinessStatus} size="sm" />
        </div>

        {/* Safety/Readiness Score */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-sky-accent px-2 py-1 rounded text-xs font-bold">{readinessScore}%</div>
          <span className="text-xs text-gray-600">Readiness score</span>
        </div>

        {/* Cost Band */}
        <div className="flex items-center gap-2 col-span-2">
          <DollarSign className="w-4 h-4 text-sand flex-shrink-0" />
          <span className="text-sm font-medium text-navy">{destination.budgetBand}</span>
        </div>
      </div>

      {/* Last Checked & Changes */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatDate(destination.lastChecked)}</span>
        </div>
        {destination.whatChanged.length > 0 && (
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">
            {destination.whatChanged.length} update{destination.whatChanged.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  );
}
