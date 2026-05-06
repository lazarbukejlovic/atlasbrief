interface LocalRulesCardProps {
  rules: string[];
}

const LocalRulesCard = ({ rules }: LocalRulesCardProps) => {
  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Local rules</div>
      <h3 className="mt-3 text-2xl font-semibold text-navy">Behavior that keeps your trip smooth</h3>
      <div className="mt-6 space-y-3">
        {rules.map((rule, index) => (
          <div key={rule} className="flex gap-4 rounded-2xl bg-white/75 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-soft text-sm font-semibold text-sky-accent">
              {index + 1}
            </div>
            <p className="text-sm leading-7 text-navy-muted">{rule}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LocalRulesCard;