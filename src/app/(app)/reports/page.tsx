import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatTile from "@/components/StatTile";
import FunnelBars from "@/components/FunnelBars";
import RevenueByServiceChart from "@/components/charts/RevenueByServiceChart";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import { leadFunnelCounts, conversionRate } from "@/lib/queries/leads";
import { revenueByService, revenueTrend, revenueAllTime } from "@/lib/queries/kpis";
import { topCustomersByRevenue } from "@/lib/queries/customers";
import { averageJobValue } from "@/lib/queries/jobs";
import { STATUS_LABEL } from "@/lib/types";

function currency(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function ReportsPage() {
  const funnel = leadFunnelCounts();
  const conversion = conversionRate();
  const byService = revenueByService();
  const trend = revenueTrend(12);
  const topCustomers = topCustomersByRevenue(5);
  const avgJob = averageJobValue();
  const total = revenueAllTime();

  const funnelData = [
    { label: STATUS_LABEL.new, value: funnel.new },
    { label: STATUS_LABEL.contacted, value: funnel.contacted },
    { label: STATUS_LABEL.quoted, value: funnel.quoted },
    { label: STATUS_LABEL.won, value: funnel.won },
    { label: STATUS_LABEL.lost, value: funnel.lost, terminal: true },
  ];

  return (
    <div>
      <PageHeader title="Reports" description="Deeper KPIs to guide business decisions." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <StatTile label="All-time revenue" value={currency(total)} />
        <StatTile label="Average job value" value={currency(avgJob)} />
        <StatTile label="Lead win rate" value={`${Math.round(conversion * 100)}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-6">
        <div className="card p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-950">Lead funnel</h2>
          <FunnelBars data={funnelData} />
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink-950">Revenue by service</h2>
          <p className="text-xs text-ink-400 mb-2">All-time, paid invoices</p>
          <RevenueByServiceChart data={byService} />
        </div>
      </div>

      <div className="card p-5 mb-6">
        <h2 className="text-sm font-semibold text-ink-950">Revenue trend</h2>
        <p className="text-xs text-ink-400 mb-2">Last 12 months</p>
        <RevenueTrendChart data={trend} />
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-950">Top customers</h2>
        {topCustomers.length === 0 ? (
          <p className="text-sm text-ink-400">No paid invoices yet.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {topCustomers.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5">
                <Link
                  href={`/crm/customers/${c.id}`}
                  className="text-sm font-medium text-ink-900 hover:text-brand-600"
                >
                  {c.name}
                </Link>
                <span className="text-sm tabular-nums text-ink-600">
                  {currency(c.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
