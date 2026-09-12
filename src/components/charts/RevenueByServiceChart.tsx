"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { CHART_INK, colorForService } from "@/lib/chartColors";

function formatCurrency(v: number) {
  return `$${Math.round(v).toLocaleString()}`;
}

export default function RevenueByServiceChart({
  data,
}: {
  data: { service: string; total: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-ink-400">
        No revenue recorded yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
        <XAxis
          dataKey="service"
          tickLine={false}
          axisLine={{ stroke: CHART_INK.baseline }}
          tick={{ fill: CHART_INK.muted, fontSize: 11 }}
          interval={0}
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
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${CHART_INK.grid}`,
            fontSize: 12,
          }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((entry, index) => (
            <Cell key={entry.service} fill={colorForService(entry.service, index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
