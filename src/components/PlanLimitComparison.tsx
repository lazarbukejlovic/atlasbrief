import { PLAN_LIMITS } from '../lib/planLimits';

const PlanLimitComparison = () => (
  <section className="glass-card rounded-[1.75rem] border border-sky-accent/20 p-6">
    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-accent">Pro limits preview</div>
    <h2 className="mt-2 text-2xl font-semibold text-navy">How Pro expands planning capacity</h2>

    <div className="mt-5 overflow-x-auto rounded-2xl border border-white/70 bg-white/85">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr className="border-b border-white/70 bg-sky-soft/60">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Capability</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Free</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Plus</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-navy-muted">Pro preview</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/70">
            <td className="px-4 py-3 text-sm font-semibold text-navy">Saved trips</td>
            <td className="px-4 py-3 text-sm text-navy-muted">{PLAN_LIMITS.free}</td>
            <td className="px-4 py-3 text-sm text-navy-muted">{PLAN_LIMITS.plus}</td>
            <td className="px-4 py-3 text-sm font-semibold text-navy">{PLAN_LIMITS.pro}</td>
          </tr>
          <tr className="border-b border-white/70">
            <td className="px-4 py-3 text-sm font-semibold text-navy">Family sharing workspace</td>
            <td className="px-4 py-3 text-sm text-navy-muted">-</td>
            <td className="px-4 py-3 text-sm text-navy-muted">-</td>
            <td className="px-4 py-3 text-sm font-semibold text-navy">Preview</td>
          </tr>
          <tr className="border-b border-white/70">
            <td className="px-4 py-3 text-sm font-semibold text-navy">Compare and stay planning history</td>
            <td className="px-4 py-3 text-sm text-navy-muted">Limited</td>
            <td className="px-4 py-3 text-sm text-navy-muted">Expanded</td>
            <td className="px-4 py-3 text-sm font-semibold text-navy">Extended preview</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-semibold text-navy">Advanced monitoring and export summaries</td>
            <td className="px-4 py-3 text-sm text-navy-muted">-</td>
            <td className="px-4 py-3 text-sm text-navy-muted">Basic monitoring</td>
            <td className="px-4 py-3 text-sm font-semibold text-navy">Pro preview</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

export default PlanLimitComparison;