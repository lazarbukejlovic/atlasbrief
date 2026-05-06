import { TrendingUp, AlertCircle } from 'lucide-react';

interface WhatChangedPanelProps {
  whatChanged: string[];
}

export default function WhatChangedPanel({ whatChanged }: WhatChangedPanelProps) {
  return (
    <section className="mt-8 glass-card rounded-[1.75rem] p-6">
      <h2 className="section-title mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-sky-accent" />
        What Changed Since Last Check
      </h2>

      {whatChanged.length > 0 ? (
        <div className="card-base p-4 bg-gradient-to-r from-blue-50/50 to-transparent border-l-4 border-sky-accent">
          <ul className="space-y-2">
            {whatChanged.map((change, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <AlertCircle className="w-4 h-4 text-sky-accent flex-shrink-0 mt-0.5" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="card-base p-4 text-center text-gray-500">
          <p className="text-sm">No changes recorded since last check.</p>
        </div>
      )}
    </section>
  );
}
