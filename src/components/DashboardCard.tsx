import type { ReactNode } from 'react';

interface DashboardCardProps {
  eyebrow: string;
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
}

const DashboardCard = ({ eyebrow, title, value, detail, icon }: DashboardCardProps) => {
  return (
    <section className="glass-card rounded-[1.75rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">{eyebrow}</div>
          <h3 className="mt-3 text-lg font-semibold text-navy">{title}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sand shadow-soft">
          {icon}
        </div>
      </div>
      <div className="mt-8 text-4xl font-semibold tracking-tight text-navy">{value}</div>
      <p className="mt-3 text-sm leading-7 text-navy-muted">{detail}</p>
    </section>
  );
};

export default DashboardCard;