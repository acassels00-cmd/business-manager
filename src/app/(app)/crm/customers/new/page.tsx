import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { createCustomerAction } from "../../actions";

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect_to?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="max-w-xl">
      <PageHeader title="New Customer" description="Add a customer to your CRM." />
      <form action={createCustomerAction} className="card space-y-4 p-5">
        {params.redirect_to && (
          <input type="hidden" name="redirect_to" value={params.redirect_to} />
        )}
        {params.error && (
          <p className="text-sm text-red-600">{params.error}</p>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Full name
          </label>
          <input
            type="text"
            name="name"
            required
            autoFocus
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Phone</label>
          <input
            type="tel"
            name="phone"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Address
          </label>
          <input
            type="text"
            name="address"
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
            Add Customer
          </button>
          <Link href="/crm/customers" className="text-sm text-ink-500 hover:text-ink-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
