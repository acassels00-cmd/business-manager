import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { listLeads } from "@/lib/queries/leads";
import { LEAD_STATUSES, STATUS_LABEL } from "@/lib/types";
import { updateLeadStatusAction } from "./actions";

function currency(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const NEXT_STATUS: Record<string, string | null> = {
  new: "contacted",
  contacted: "quoted",
  quoted: "won",
  won: null,
  lost: null,
};

export default function CrmPage() {
  const leads = listLeads();
  const columns = LEAD_STATUSES.map((status) => ({
    status,
    leads: leads.filter((l) => l.status === status),
  }));

  return (
    <div>
      <PageHeader
        title="CRM"
        description="Track leads from first contact through to a won job."
        actions={
          <>
            <Link
              href="/crm/customers"
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 transition"
            >
              Customers
            </Link>
            <Link
              href="/crm/leads/new"
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              + New Lead
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {columns.map((col) => (
          <div key={col.status} className="min-w-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                {STATUS_LABEL[col.status]}
              </h2>
              <span className="text-xs text-ink-400">{col.leads.length}</span>
            </div>
            <div className="space-y-2">
              {col.leads.map((lead) => {
                const next = NEXT_STATUS[lead.status];
                return (
                  <div key={lead.id} className="card p-3">
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="block text-sm font-medium text-ink-900 hover:text-brand-600"
                    >
                      {lead.customer_name}
                    </Link>
                    <div className="mt-0.5 text-xs text-ink-400">{lead.service}</div>
                    <div className="mt-1 text-sm font-semibold tabular-nums text-ink-700">
                      {currency(lead.estimated_value)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {next && (
                        <form action={updateLeadStatusAction}>
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="status" value={next} />
                          <button
                            type="submit"
                            className="rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 transition"
                          >
                            Move to {STATUS_LABEL[next]} &rarr;
                          </button>
                        </form>
                      )}
                      {lead.status !== "lost" && lead.status !== "won" && (
                        <form action={updateLeadStatusAction}>
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="status" value="lost" />
                          <button
                            type="submit"
                            className="rounded-md px-2 py-1 text-xs font-medium text-ink-400 hover:bg-ink-100 transition"
                          >
                            Mark lost
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
              {col.leads.length === 0 && (
                <div className="rounded-lg border border-dashed border-ink-200 p-3 text-center text-xs text-ink-400">
                  No leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
