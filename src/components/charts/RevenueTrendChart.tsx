"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_INK, SEQUENTIAL_BLUE } from "@/lib/chartColors";

function formatMonth(month: string) {
  const [y, m] = month.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short" });
}

function formatCurrency(v: number) {
  return `$${Math.round(v).toLocaleString()}`;
}

export default function RevenueTrendChart({
  data,
}: {
  data: { month: string; total: number }[];
}) {
  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.month) }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SEQUENTIAL_BLUE} stopOpacity={0.25} />
            <stop offset="100%" stopColor={SEQUENTIAL_BLUE} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke={CHART_INK.grid}
          strokeDasharray="0"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: CHART_INK.baseline }}
          tick={{ fill: CHART_INK.muted, fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART_INK.muted, fontSize: 12 }}
          tickFormatter={formatCurrency}
          width={64}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
          labelFormatter={(label) => label}
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${CHART_INK.grid}`,
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke={SEQUENTIAL_BLUE}
          strokeWidth={2}
          fill="url(#revenueFill)"
          dot={{ r: 3, fill: SEQUENTIAL_BLUE, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
