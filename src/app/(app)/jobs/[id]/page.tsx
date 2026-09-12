import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import { getJob } from "@/lib/queries/jobs";
import { listServices } from "@/lib/queries/services";
import { db } from "@/lib/db";
import { JOB_STATUSES, STATUS_LABEL } from "@/lib/types";
import {
  updateJobAction,
  updateJobStatusAction,
  deleteJobAction,
  createInvoiceFromJobAction,
} from "../actions";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(Number(id));
  if (!job) notFound();

  const services = listServices(true);
  const existingInvoice = db
    .prepare("SELECT id FROM invoices WHERE job_id = ?")
    .get(job.id) as { id: number } | undefined;

  return (
    <div className="max-w-xl">
      <PageHeader
        title={job.customer_name}
        description={`Job #${job.id}`}
        actions={<StatusPill status={job.status} />}
      />

      <div className="card mb-4 p-5">
        <h2 className="mb-2 text-sm font-semibold text-ink-950">Status</h2>
        <div className="flex flex-wrap gap-2">
          {JOB_STATUSES.map((status) => (
            <form key={status} action={updateJobStatusAction}>
              <input type="hidden" name="id" value={job.id} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                disabled={job.status === status}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  job.status === status
                    ? "bg-brand-600 text-white"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {STATUS_LABEL[status]}
              </button>
            </form>
          ))}
        </div>
      </div>

      <form action={updateJobAction} className="card space-y-4 p-5">
        <input type="hidden" name="id" value={job.id} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Service</label>
          <select
            name="service"
            defaultValue={job.service}
            required
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Scheduled date
          </label>
          <input
            type="date"
            name="scheduled_date"
            defaultValue={job.scheduled_date.slice(0, 10)}
            required
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            defaultValue={job.price}
            required
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={job.notes || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Save
          </button>
          <Link href="/jobs" className="text-sm text-ink-500 hover:text-ink-700">
            Back
          </Link>
        </div>
      </form>

      {!existingInvoice && (
        <form action={createInvoiceFromJobAction} className="mt-4 card space-y-3 p-5">
          <input type="hidden" name="job_id" value={job.id} />
          <input type="hidden" name="customer_id" value={job.customer_id} />
          <h2 className="text-sm font-semibold text-ink-950">Create invoice</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0"
              defaultValue={job.price}
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Create Invoice
          </button>
        </form>
      )}
      {existingInvoice && (
        <div className="mt-4 card p-5">
          <p className="text-sm text-ink-600">
            Invoice already created for this job.{" "}
            <Link href="/invoices" className="text-brand-600 hover:underline">
              View invoices
            </Link>
          </p>
        </div>
      )}

      <form action={deleteJobAction} className="mt-4">
        <input type="hidden" name="id" value={job.id} />
        <button type="submit" className="text-xs text-red-500 hover:underline">
          Delete job
        </button>
      </form>
    </div>
  );
}
