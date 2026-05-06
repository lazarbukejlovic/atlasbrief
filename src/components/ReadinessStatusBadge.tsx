import { ReadinessStatus } from '../data/destinations';
import { AlertCircle, CheckCircle2, Eye } from 'lucide-react';

interface ReadinessStatusBadgeProps {
  status: ReadinessStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function ReadinessStatusBadge({ status, size = 'md' }: ReadinessStatusBadgeProps) {
  const config = {
    Ready: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle2,
      label: 'Ready',
    },
    Review: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: AlertCircle,
      label: 'Review',
    },
    'Watch Closely': {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: Eye,
      label: 'Watch Closely',
    },
  };

  const current = config[status];
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`${current.bg} ${current.border} ${current.text} border rounded-full flex items-center gap-1.5 w-fit font-medium ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      <span>{current.label}</span>
    </div>
  );
}
