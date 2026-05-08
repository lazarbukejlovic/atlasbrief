interface SourcePolicyNoticeProps {
  compact?: boolean;
}

const SourcePolicyNotice = ({ compact = false }: SourcePolicyNoticeProps) => {
  return (
    <div className={`rounded-2xl border border-amber-300/70 bg-amber-50/80 ${compact ? 'p-3' : 'p-4'} text-amber-950`}>
      <p className={`${compact ? 'text-xs' : 'text-sm'} leading-6`}>
        AtlasBrief provides planning snapshots, not legal advice. Verify visa, entry, tax, insurance, and safety requirements with official sources before booking.
      </p>
    </div>
  );
};

export default SourcePolicyNotice;
