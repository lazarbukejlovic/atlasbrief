import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCostIndexValue, type Destination } from '../data/destinations';

interface CostIndexChartProps {
  destinations: Destination[];
}

const CostIndexChart = ({ destinations }: CostIndexChartProps) => {
  const data = destinations.map((destination) => ({
    city: destination.city,
    value: getCostIndexValue(destination),
  }));

  return (
    <section className="glass-card rounded-[1.75rem] p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-accent">Cost intelligence</div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className="text-2xl font-semibold text-navy">Relative monthly burn by destination</h3>
        <p className="max-w-sm text-right text-sm text-navy-muted">AtlasBrief uses a simple cost index so you can compare landing environments, not just sticker prices.</p>
      </div>
      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="city" tickLine={false} axisLine={false} tick={{ fill: '#4A5E7A', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#4A5E7A', fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
            <Bar dataKey="value" radius={[14, 14, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.city} fill={entry.value >= 80 ? '#D4A853' : '#60A5FA'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CostIndexChart;