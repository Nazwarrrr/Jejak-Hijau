import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { formatAmount } from '../../lib/utils';

export default function WeeklyChart({ chartData = [] }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Konsistensi kecil berarti</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">
            Tren 7 hari terakhir
          </h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          kg CO₂
        </span>
      </div>

      <div
        className="h-52 w-full"
        role="img"
        aria-label="Grafik emisi karbon selama tujuh hari terakhir"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -22, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e8f0ed"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: '#f0fdf4' }}
              formatter={(value) => [`${formatAmount(Number(value))} kg CO₂`, 'Emisi']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #d1fae5',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, .08)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0f172a',
              }}
            />
            <Bar dataKey="total" radius={[7, 7, 2, 2]} maxBarSize={34}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`bar-${entry.day}-${index}`}
                  fill={entry.isToday ? '#059669' : '#a7d8c6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
