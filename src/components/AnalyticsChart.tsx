import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AnalyticsChartProps {
  title: string;
  data: { name: string; value: number }[];
  color: string;
}

export default function AnalyticsChart({ title, data, color }: AnalyticsChartProps) {
  return (
    <div className="glass-card rounded-3xl border border-white/70 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-text/50">Analytics</p>
          <h3 className="mt-2 text-xl font-semibold text-text">{title}</h3>
        </div>
        <span className="rounded-3xl bg-primary/10 px-3 py-1 text-sm font-semibold text-primaryDark">Weekly trend</span>
      </div>
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 6" stroke="#d8d3a8" opacity={0.4} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#5A5A5A' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#5A5A5A' }} />
            <Tooltip wrapperStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={4} dot={{ r: 5, fill: '#fff', stroke: color, strokeWidth: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
