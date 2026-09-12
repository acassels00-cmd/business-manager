import PageHeader from "@/components/PageHeader";
import { listServices } from "@/lib/queries/services";
import { getAllSettings } from "@/lib/queries/settings";
import {
  updateBusinessProfileAction,
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "./actions";

export default function SettingsPage() {
  const services = listServices();
  const settings = getAllSettings();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Business profile and service pricing." />

      <form action={updateBusinessProfileAction} className="card space-y-4 p-5 mb-6">
        <h2 className="text-sm font-semibold text-ink-950">Business profile</h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Business name
          </label>
          <input
            type="text"
            name="business_name"
            defaultValue={settings.business_name || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Phone</label>
          <input
            type="tel"
            name="business_phone"
            defaultValue={settings.business_phone || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            name="business_email"
            defaultValue={settings.business_email || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Address</label>
          <input
            type="text"
            name="business_address"
            defaultValue={settings.business_address || ""}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          Save profile
        </button>
      </form>

      <div className="card p-5 mb-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-950">Services & pricing</h2>
        <div className="space-y-3">
          {services.map((s) => (
            <form
              key={s.id}
              action={updateServiceAction}
              className="flex flex-wrap items-end gap-2 rounded-lg border border-ink-100 p-3"
            >
              <input type="hidden" name="id" value={s.id} />
              <div className="flex-1 min-w-[140px]">
                <label className="mb-1 block text-xs font-medium text-ink-500">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={s.name}
                  className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div className="w-28">
                <label className="mb-1 block text-xs font-medium text-ink-500">
                  Base price
                </label>
                <input
                  type="number"
                  name="base_price"
                  step="0.01"
                  defaultValue={s.base_price}
                  className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="mb-1 block text-xs font-medium text-ink-500">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  defaultValue={s.description || ""}
                  className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <label className="flex items-center gap-1.5 pb-1.5 text-xs text-ink-500">
                <input type="checkbox" name="active" defaultChecked={!!s.active} />
                Active
              </label>
              <button
                type="submit"
                className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
              >
                Save
              </button>
            </form>
          ))}
        </div>

        <form
          action={createServiceAction}
          className="mt-4 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-ink-200 p-3"
        >
          <div className="flex-1 min-w-[140px]">
            <label className="mb-1 block text-xs font-medium text-ink-500">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="New service name"
              className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="w-28">
            <label className="mb-1 block text-xs font-medium text-ink-500">
              Base price
            </label>
            <input
              type="number"
              name="base_price"
              step="0.01"
              required
              className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="mb-1 block text-xs font-medium text-ink-500">
              Description
            </label>
            <input
              type="text"
              name="description"
              className="w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-ink-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink-900 transition"
          >
            + Add service
          </button>
        </form>
      </div>

      <details className="text-xs text-ink-400">
        <summary className="cursor-pointer">Remove a service</summary>
        <div className="mt-2 space-y-2">
          {services.map((s) => (
            <form key={s.id} action={deleteServiceAction} className="flex items-center gap-2">
              <input type="hidden" name="id" value={s.id} />
              <span>{s.name}</span>
              <button type="submit" className="text-red-500 hover:underline">
                Delete
              </button>
            </form>
          ))}
        </div>
      </details>
    </div>
  );
}
