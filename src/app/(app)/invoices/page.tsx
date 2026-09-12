import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import StatTile from "@/components/StatTile";
import { listInvoices, outstandingBalance, markOverdueInvoices } from "@/lib/queries/invoices";
import { updateInvoiceStatusAction } from "./actions";

function currency(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  markOverdueInvoices();
  const filter = (await searchParams).status;
  const invoices = listInvoices().filter((i) => !filter || i.status === filter);
  const outstanding = outstandingBalance();
  const paidTotal = listInvoices()
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div>
      <PageHeader title="Invoices" description="Track billing and payments." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
        <StatTile label="Outstanding balance" value={currency(outstanding)} />
        <StatTile label="Total collected" value={currency(paidTotal)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["", "unpaid", "overdue", "paid"].map((status) => (
          <Link
            key={status || "all"}
            href={status ? `/invoices?status=${status}` : "/invoices"}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === status || (!filter && !status)
                ? "bg-brand-600 text-white"
                : "bg-ink-100 text-ink-600 hover:bg-ink-200"
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-4 py-2.5">Customer</th>
              <th className="px-4 py-2.5">Service</th>
              <th className="px-4 py-2.5">Issued</th>
              <th className="px-4 py-2.5 text-right">Amount</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-ink-50">
                <td className="px-4 py-2.5 font-medium text-ink-900">
                  {inv.customer_name}
                </td>
                <td className="px-4 py-2.5 text-ink-500">{inv.service || "—"}</td>
                <td className="px-4 py-2.5 text-ink-500">
                  {new Date(inv.issued_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                  {currency(inv.amount)}
                </td>
                <td className="px-4 py-2.5">
                  <StatusPill status={inv.status} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  {inv.status !== "paid" && (
                    <form action={updateInvoiceStatusAction}>
                      <input type="hidden" name="id" value={inv.id} />
                      <input type="hidden" name="status" value="paid" />
                      <button
                        type="submit"
                        className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition"
                      >
                        Mark paid
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-400">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
