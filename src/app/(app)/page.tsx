import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatTile from "@/components/StatTile";
import StatusPill from "@/components/StatusPill";
import RevenueTrendChart from "@/components/charts/RevenueTrendChart";
import RevenueByServiceChart from "@/components/charts/RevenueByServiceChart";
import {
  revenueThisMonth,
  revenueByService,
  revenueTrend,
  activeLeadsCount,
  recentActivity,
} from "@/lib/queries/kpis";
import { jobsCompletedThisMonth, upcomingJobs, averageJobValue } from "@/lib/queries/jobs";
import { conversionRate } from "@/lib/queries/leads";
import { outstandingBalance, markOverdueInvoices } from "@/lib/queries/invoices";

function currency(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso + "Z").getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardPage() {
  markOverdueInvoices();

  const revenue = revenueThisMonth();
  const jobsDone = jobsCompletedThisMonth();
  const leads = activeLeadsCount();
  const conversion = conversionRate();
  const avgJob = averageJobValue();
  const outstanding = outstandingBalance();
  const upcoming = upcomingJobs(6);
  const activity = recentActivity(8);
  const byService = revenueByService();
  const trend = revenueTrend(6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your business at a glance."
        actions={
          <Link
            href="/jobs/new"
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            + Schedule Job
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Revenue this month" value={currency(revenue)} />
        <StatTile label="Jobs completed this month" value={String(jobsDone)} />
        <StatTile
          label="Active leads"
          value={String(leads)}
          sublabel={`${Math.round(conversion * 100)}% win rate`}
        />
        <StatTile
          label="Outstanding balance"
          value={currency(outstanding)}
          sublabel="Unpaid + overdue invoices"
          accent={outstanding > 0 ? "#8a5a00" : undefined}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Average job value" value={currency(avgJob)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink-950">Revenue trend</h2>
          <p className="text-xs text-ink-400 mb-2">Last 6 months, paid invoices</p>
          <RevenueTrendChart data={trend} />
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink-950">Revenue by service</h2>
          <p className="text-xs text-ink-400 mb-2">All-time, paid invoices</p>
          <RevenueByServiceChart data={byService} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-950">Upcoming jobs</h2>
            <Link href="/jobs" className="text-xs font-medium text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-400">No upcoming jobs scheduled.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {upcoming.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <div className="text-sm font-medium text-ink-900">
                      {job.customer_name}
                    </div>
                    <div className="text-xs text-ink-400">
                      {job.service} &middot;{" "}
                      {new Date(job.scheduled_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <StatusPill status={job.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-950">Recent activity</h2>
          {activity.length === 0 ? (
            <p className="text-sm text-ink-400">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {activity.map((entry) => (
                <li key={entry.id} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                  <div>
                    <div className="text-ink-800">{entry.message}</div>
                    <div className="text-xs text-ink-400">{timeAgo(entry.created_at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
