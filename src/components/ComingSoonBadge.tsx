interface ComingSoonBadgeProps {
  label?: string;
}

const ComingSoonBadge = ({ label = 'Coming soon' }: ComingSoonBadgeProps) => (
  <span className="inline-flex rounded-full border border-sand/40 bg-sand/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-navy">
    {label}
  </span>
);

export default ComingSoonBadge;