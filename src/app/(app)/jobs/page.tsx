import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import { listJobs } from "@/lib/queries/jobs";
import { JOB_STATUSES, STATUS_LABEL } from "@/lib/types";

function currency(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const filter = (await searchParams).status;
  const jobs = listJobs().filter((j) => !filter || j.status === filter);

  return (
    <div>
      <PageHeader
        title="Jobs & Schedule"
        description="Every job, past and upcoming."
        actions={
          <Link
            href="/jobs/new"
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            + Schedule Job
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/jobs"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !filter ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
          }`}
        >
          All
        </Link>
        {JOB_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/jobs?status=${status}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === status
                ? "bg-brand-600 text-white"
                : "bg-ink-100 text-ink-600 hover:bg-ink-200"
            }`}
          >
            {STATUS_LABEL[status]}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-4 py-2.5">Customer</th>
              <th className="px-4 py-2.5">Service</th>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5 text-right">Price</th>
              <th className="px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-ink-50">
                <td className="px-4 py-2.5">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium text-ink-900 hover:text-brand-600"
                  >
                    {job.customer_name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-ink-600">{job.service}</td>
                <td className="px-4 py-2.5 text-ink-600">
                  {new Date(job.scheduled_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                  {currency(job.price)}
                </td>
                <td className="px-4 py-2.5">
                  <StatusPill status={job.status} />
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-400">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
