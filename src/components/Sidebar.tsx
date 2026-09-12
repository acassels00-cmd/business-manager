"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/crm", label: "CRM", icon: "◉" },
  { href: "/jobs", label: "Jobs & Schedule", icon: "▤" },
  { href: "/invoices", label: "Invoices", icon: "▣" },
  { href: "/reports", label: "Reports", icon: "▲" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-ink-200 bg-brand-950 text-white">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold">
          GW
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">Gator Wash</div>
          <div className="text-xs text-brand-300 leading-tight">Solutions</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-brand-200 hover:bg-brand-900 hover:text-white"
              }`}
            >
              <span className="w-4 text-center text-xs">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action="/logout" method="POST" className="px-3 pb-5">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-300 hover:bg-brand-900 hover:text-white transition"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
