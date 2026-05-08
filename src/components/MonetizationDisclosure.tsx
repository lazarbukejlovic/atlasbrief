interface MonetizationDisclosureProps {
  compact?: boolean;
}

const MonetizationDisclosure = ({ compact = false }: MonetizationDisclosureProps) => (
  <div className={`rounded-[1.25rem] border border-sky-accent/20 bg-sky-50/60 ${compact ? 'p-4' : 'p-5'}`}>
    <p className={`${compact ? 'text-xs leading-6' : 'text-sm leading-7'} text-navy-muted`}>
      <span className="font-semibold text-navy">Disclosure:</span> Some links may become affiliate or partner redirects in the future.
      AtlasBrief does not complete bookings directly and does not replace official travel, visa, insurance, or booking advice.
    </p>
  </div>
);

export default MonetizationDisclosure;