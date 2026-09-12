import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { listCustomers, searchCustomers, customerRevenue } from "@/lib/queries/customers";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const customers = q ? searchCustomers(q) : listCustomers();

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} customer${customers.length === 1 ? "" : "s"}`}
        actions={
          <Link
            href="/crm/customers/new"
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            + New Customer
          </Link>
        }
      />

      <form className="mb-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, or phone..."
          className="w-full max-w-sm rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Contact</th>
              <th className="px-4 py-2.5">Address</th>
              <th className="px-4 py-2.5 text-right">Lifetime Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-ink-50">
                <td className="px-4 py-2.5">
                  <Link
                    href={`/crm/customers/${c.id}`}
                    className="font-medium text-ink-900 hover:text-brand-600"
                  >
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-ink-500">
                  {c.email && <div>{c.email}</div>}
                  {c.phone && <div>{c.phone}</div>}
                </td>
                <td className="px-4 py-2.5 text-ink-500">{c.address || "—"}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                  ${customerRevenue(c.id).toLocaleString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
