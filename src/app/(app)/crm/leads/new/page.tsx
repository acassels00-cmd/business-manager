import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { listCustomers } from "@/lib/queries/customers";
import { listServices } from "@/lib/queries/services";
import { createLeadAction } from "../../actions";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; customer_id?: string }>;
}) {
  const params = await searchParams;
  const customers = listCustomers();
  const services = listServices(true);

  return (
    <div className="max-w-xl">
      <PageHeader title="New Lead" description="Add a new lead to the pipeline." />

      {customers.length === 0 ? (
        <div className="card p-5">
          <p className="text-sm text-ink-600">
            You need at least one customer before creating a lead.
          </p>
          <Link
            href="/crm/customers/new"
            className="mt-3 inline-block rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Add a customer
          </Link>
        </div>
      ) : (
        <form action={createLeadAction} className="card space-y-4 p-5">
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
            <p className="mt-1 text-xs text-ink-400">
              Don&apos;t see them?{" "}
              <Link href="/crm/customers/new" className="text-brand-600 hover:underline">
                Add a new customer
              </Link>
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Service
            </label>
            <select
              name="service"
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
              Estimated value ($)
            </label>
            <input
              type="number"
              name="estimated_value"
              step="0.01"
              min="0"
              required
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Source
            </label>
            <input
              type="text"
              name="source"
              placeholder="Referral, Google, Facebook..."
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Notes
            </label>
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
              Create Lead
            </button>
            <Link href="/crm" className="text-sm text-ink-500 hover:text-ink-700">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
