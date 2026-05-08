import { CheckCircle2 } from 'lucide-react';

interface ProFeatureCardProps {
  title: string;
  description: string;
}

const ProFeatureCard = ({ title, description }: ProFeatureCardProps) => (
  <article className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-soft">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-xl bg-sky-soft p-2 text-sky-accent">
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-sm leading-7 text-navy-muted">{description}</p>
      </div>
    </div>
  </article>
);

export default ProFeatureCard;