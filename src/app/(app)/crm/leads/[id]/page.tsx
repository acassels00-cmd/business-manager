import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import { getLead } from "@/lib/queries/leads";
import { listServices } from "@/lib/queries/services";
import { LEAD_STATUSES, STATUS_LABEL } from "@/lib/types";
import { updateLeadAction, updateLeadStatusAction, deleteLeadAction } from "../../actions";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = getLead(Number(id));
  if (!lead) notFound();

  const services = listServices(true);

  return (
    <div className="max-w-xl">
      <PageHeader
        title={lead.customer_name}
        description={`Lead #${lead.id}`}
        actions={<StatusPill status={lead.status} />}
      />

      <div className="card mb-4 p-5">
        <h2 className="mb-2 text-sm font-semibold text-ink-950">Status</h2>
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((status) => (
            <form key={status} action={updateLeadStatusAction}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                disabled={lead.status === status}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  lead.status === status
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

      <form action={updateLeadAction} className="card space-y-4 p-5">
        <input type="hidden" name="id" value={lead.id} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Service</label>
          <select
            name="service"
            defaultValue={lead.service}
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
            defaultValue={lead.estimated_value}
            required
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Source</label>
          <input
            type="text"
            name="source"
            defaultValue={lead.source || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={lead.notes || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
            >
              Save
            </button>
            <Link href="/crm" className="text-sm text-ink-500 hover:text-ink-700">
              Back
            </Link>
          </div>
        </div>
      </form>

      {lead.status === "won" && (
        <div className="mt-4 card p-5">
          <p className="text-sm text-ink-600">
            This lead is won. Ready to put it on the schedule?
          </p>
          <Link
            href={`/jobs/new?customer_id=${lead.customer_id}&lead_id=${lead.id}&service=${encodeURIComponent(
              lead.service
            )}`}
            className="mt-3 inline-block rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Schedule Job
          </Link>
        </div>
      )}

      <form action={deleteLeadAction} className="mt-4">
        <input type="hidden" name="id" value={lead.id} />
        <button type="submit" className="text-xs text-red-500 hover:underline">
          Delete lead
        </button>
      </form>
    </div>
  );
}
