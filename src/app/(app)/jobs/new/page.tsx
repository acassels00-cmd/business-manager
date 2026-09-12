import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { listCustomers } from "@/lib/queries/customers";
import { listServices } from "@/lib/queries/services";
import { createJobAction } from "../actions";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    customer_id?: string;
    lead_id?: string;
    service?: string;
  }>;
}) {
  const params = await searchParams;
  const customers = listCustomers();
  const services = listServices(true);
  const matchedService = services.find((s) => s.name === params.service);

  return (
    <div className="max-w-xl">
      <PageHeader title="Schedule Job" description="Add a job to the schedule." />

      {customers.length === 0 ? (
        <div className="card p-5">
          <p className="text-sm text-ink-600">
            You need at least one customer before scheduling a job.
          </p>
          <Link
            href="/crm/customers/new"
            className="mt-3 inline-block rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Add a customer
          </Link>
        </div>
      ) : (
        <form action={createJobAction} className="card space-y-4 p-5">
          {params.lead_id && (
            <input type="hidden" name="lead_id" value={params.lead_id} />
          )}
          {params.error && (
            <p className="text-sm text-red-600">{params.error}</p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Customer
            </label>
            <select
              name="customer_id"
              required
              defaultValue={params.customer_id || ""}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Service
            </label>
            <select
              name="service"
              required
              defaultValue={params.service || ""}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="" disabled>
                Select a service
              </option>
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
              required
              defaultValue={matchedService?.base_price ?? undefined}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Notes</label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Schedule Job
            </button>
            <Link href="/jobs" className="text-sm text-ink-500 hover:text-ink-700">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
