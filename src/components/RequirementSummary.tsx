import { FileText, CreditCard, Pill } from 'lucide-react';

interface RequirementSummaryProps {
  requirementSummary: string;
  passportValidityNote: string;
  visaSnapshot: string;
  healthSnapshot: string;
}

export default function RequirementSummary({
  requirementSummary,
  passportValidityNote,
  visaSnapshot,
  healthSnapshot,
}: RequirementSummaryProps) {
  return (
    <section className="mt-8 glass-card rounded-[1.75rem] p-6">
      <h2 className="section-title mb-4">Entry & Documents Snapshot</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requirement Summary */}
        <div className="card-base p-4 bg-white/80">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-sky-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-navy mb-1">Entry Requirements</h4>
              <p className="text-sm text-gray-600">{requirementSummary}</p>
            </div>
          </div>
        </div>

        {/* Passport Validity */}
        <div className="card-base p-4 bg-white/80">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-sand flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-navy mb-1">Passport Validity</h4>
              <p className="text-sm text-gray-600">{passportValidityNote}</p>
            </div>
          </div>
        </div>

        {/* Visa Snapshot */}
        <div className="card-base p-4 bg-white/80">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-navy mb-1">Visa Status</h4>
              <p className="text-sm text-gray-600">{visaSnapshot}</p>
            </div>
          </div>
        </div>

        {/* Health Requirements */}
        <div className="card-base p-4 bg-white/80">
          <div className="flex items-start gap-3">
            <Pill className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-navy mb-1">Health</h4>
              <p className="text-sm text-gray-600">{healthSnapshot}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
