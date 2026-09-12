import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import { getCustomer, customerRevenue } from "@/lib/queries/customers";
import { leadsByCustomer } from "@/lib/queries/leads";
import { jobsByCustomer } from "@/lib/queries/jobs";
import { invoicesByCustomer } from "@/lib/queries/invoices";
import { updateCustomerAction, deleteCustomerAction } from "../../actions";

function currency(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  const customer = getCustomer(id);
  if (!customer) notFound();

  const leads = leadsByCustomer(id);
  const jobs = jobsByCustomer(id);
  const invoices = invoicesByCustomer(id);
  const revenue = customerRevenue(id);

  return (
    <div>
      <PageHeader
        title={customer.name}
        description="Customer profile & history"
        actions={
          <Link
            href={`/crm/leads/new?customer_id=${customer.id}`}
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            + New Lead
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-950">Job history</h2>
            {jobs.length === 0 ? (
              <p className="text-sm text-ink-400">No jobs yet.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {jobs.map((job) => (
                  <li key={job.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="text-sm font-medium text-ink-900">{job.service}</div>
                      <div className="text-xs text-ink-400">
                        {new Date(job.scheduled_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums text-ink-600">
                        {currency(job.price)}
                      </span>
                      <StatusPill status={job.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-950">Leads</h2>
            {leads.length === 0 ? (
              <p className="text-sm text-ink-400">No leads yet.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {leads.map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between py-2.5">
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="text-sm font-medium text-ink-900 hover:text-brand-600"
                    >
                      {lead.service}
                    </Link>
                    <StatusPill status={lead.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink-950">Invoices</h2>
            {invoices.length === 0 ? (
              <p className="text-sm text-ink-400">No invoices yet.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {invoices.map((inv) => (
                  <li key={inv.id} className="flex items-center justify-between py-2.5">
                    <div className="text-sm text-ink-900">
                      {new Date(inv.issued_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums text-ink-600">
                        {currency(inv.amount)}
                      </span>
                      <StatusPill status={inv.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Lifetime revenue
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {currency(revenue)}
            </div>
          </div>

          <form action={updateCustomerAction} className="card space-y-3 p-5">
            <input type="hidden" name="id" value={customer.id} />
            <h2 className="text-sm font-semibold text-ink-950">Contact info</h2>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={customer.name}
                required
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={customer.email || ""}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Phone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={customer.phone || ""}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Address</label>
              <input
                type="text"
                name="address"
                defaultValue={customer.address || ""}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Notes</label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={customer.notes || ""}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Save
            </button>
          </form>

          <form action={deleteCustomerAction}>
            <input type="hidden" name="id" value={customer.id} />
            <button type="submit" className="text-xs text-red-500 hover:underline">
              Delete customer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
