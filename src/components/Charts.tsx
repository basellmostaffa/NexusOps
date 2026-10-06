import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { customerGrowth, revenueData } from '../data'

export function RevenueChart({ compact = false, data = revenueData }: { compact?: boolean; data?: Array<{ month: string; revenue: number; target?: number }> }) {
  return <ResponsiveContainer width="100%" height={compact ? 190 : 275}>
    <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <defs><linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f9735b" stopOpacity={0.18} /><stop offset="100%" stopColor="#f9735b" stopOpacity={0} /></linearGradient></defs>
      <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={(v) => `$${v}k`} />
      <Tooltip contentStyle={{ border: '1px solid var(--line)', borderRadius: 8, background: 'var(--panel)', color: 'var(--ink)', fontSize: 12 }} formatter={(value) => [`$${value}k`, 'Revenue']} />
      <Area type="monotone" dataKey="revenue" stroke="#f9735b" strokeWidth={2.5} fill="url(#fillRevenue)" />
      <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 5" dot={false} />
    </AreaChart>
  </ResponsiveContainer>
}
export function GrowthChart({ compact = false, data = customerGrowth }: { compact?: boolean; data?: Array<{ month: string; value: number }> }) {
  return <ResponsiveContainer width="100%" height={compact ? 190 : 275}>
    <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} />
      <Tooltip contentStyle={{ border: '1px solid var(--line)', borderRadius: 8, background: 'var(--panel)', color: 'var(--ink)', fontSize: 12 }} />
      <Line type="monotone" dataKey="value" stroke="#0ea88a" strokeWidth={2.5} dot={{ r: 3, fill: '#0ea88a', strokeWidth: 0 }} />
    </LineChart>
  </ResponsiveContainer>
}
