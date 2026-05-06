import { DollarSign } from 'lucide-react';
import { CostLevel } from '../data/destinations';

interface BudgetBandCardProps {
  budgetBand: string;
  costLevel: CostLevel;
  monthlyCostEstimate: number;
}

export default function BudgetBandCard({
  budgetBand,
  costLevel,
  monthlyCostEstimate,
}: BudgetBandCardProps) {
  const costLevelLabel = costLevel === 'Lean' ? 'Budget-Friendly' : costLevel === 'Balanced' ? 'Moderate' : 'Premium';
  const costLevelColor =
    costLevel === 'Lean' ? 'text-green-700' : costLevel === 'Balanced' ? 'text-blue-700' : 'text-orange-700';
  const costLevelBg =
    costLevel === 'Lean' ? 'bg-green-50' : costLevel === 'Balanced' ? 'bg-blue-50' : 'bg-orange-50';

  return (
    <section className="mt-8 glass-card rounded-[1.75rem] p-6">
      <h2 className="section-title mb-3 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-sand" />
        Cost Expectations
      </h2>

      <div className="card-base p-6 bg-gradient-to-br from-ivory to-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Band */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Estimated Monthly Budget</p>
            <p className="text-2xl font-bold text-navy mb-1">{budgetBand}</p>
            <p className="text-xs text-gray-500">Covers housing, food, local transport, and utilities.</p>
          </div>

          {/* Cost Level */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Cost Tier</p>
            <div className={`${costLevelBg} ${costLevelColor} px-4 py-3 rounded-lg w-fit`}>
              <p className="font-semibold text-sm">{costLevelLabel}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Relative to other global destinations.</p>
          </div>
        </div>

        {/* Detail Note */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            💡 <strong>Note:</strong> Budget estimates are based on local data and historical trends. Actual costs vary by accommodation choice, dining preferences, and personal spending. Factor in flights, visas, and travel insurance separately.
          </p>
          <p className="mt-2 text-xs text-blue-800/80">
            Current reference estimate: ${monthlyCostEstimate.toLocaleString()} per month.
          </p>
        </div>
      </div>
    </section>
  );
}
