import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
  ctaTo?: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  ctaNote?: string;
}

const PricingCard = ({
  name,
  price,
  description,
  features,
  featured = false,
  ctaLabel,
  ctaTo,
  onCtaClick,
  ctaDisabled = false,
  ctaNote,
}: PricingCardProps) => {
  const ctaClassName = `mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${featured ? 'bg-white text-navy hover:bg-ivory disabled:bg-white/70' : 'bg-navy text-white hover:bg-navy-light disabled:bg-navy/60'}`;

  return (
    <article
      className={`rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 ${featured ? 'bg-navy text-white shadow-card-hover' : 'glass-card text-navy'}`}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">{name}</div>
      <div className="mt-6 text-5xl font-semibold tracking-tight">{price}</div>
      <p className={`mt-4 text-sm leading-7 ${featured ? 'text-white/78' : 'text-navy-muted'}`}>{description}</p>
      <div className="mt-8 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm leading-7">
            <Check className={`mt-1 h-5 w-5 shrink-0 ${featured ? 'text-sand' : 'text-success'}`} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      {onCtaClick ? (
        <button type="button" onClick={onCtaClick} className={ctaClassName} disabled={ctaDisabled}>
          {ctaLabel}
        </button>
      ) : ctaTo ? (
        <Link to={ctaTo} className={ctaClassName}>
          {ctaLabel}
        </Link>
      ) : null}
          {ctaNote ? (
            <p className={`mt-3 text-center text-xs ${featured ? 'text-white/60' : 'text-navy-muted'}`}>{ctaNote}</p>
          ) : null}
    </article>
  );
};

export default PricingCard;