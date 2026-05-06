import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

const EmptyState = ({ title, description, actionLabel, actionHref }: EmptyStateProps) => {
  return (
    <section className="glass-card rounded-[2rem] p-8 text-center sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-soft text-3xl text-sky-accent shadow-soft">
        A
      </div>
      <h2 className="mt-6 text-3xl font-semibold text-navy">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-navy-muted">{description}</p>
      <Link to={actionHref} className="mt-8 inline-flex rounded-2xl bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-light">
        {actionLabel}
      </Link>
    </section>
  );
};

export default EmptyState;