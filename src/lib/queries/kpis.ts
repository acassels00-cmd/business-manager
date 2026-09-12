import { db } from "@/lib/db";
import type { ActivityLogEntry } from "@/lib/types";

export function revenueThisMonth(): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) as total FROM invoices
       WHERE status = 'paid' AND strftime('%Y-%m', paid_date) = strftime('%Y-%m', 'now')`
    )
    .get() as { total: number };
  return row.total;
}

export function revenueAllTime(): number {
  const row = db
    .prepare("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'paid'")
    .get() as { total: number };
  return row.total;
}

export function activeLeadsCount(): number {
  const row = db
    .prepare(
      "SELECT COUNT(*) as c FROM leads WHERE status IN ('new','contacted','quoted')"
    )
    .get() as { c: number };
  return row.c;
}

export interface RevenueByService {
  service: string;
  total: number;
}

export function revenueByService(): RevenueByService[] {
  return db
    .prepare(
      `SELECT jobs.service as service, COALESCE(SUM(invoices.amount), 0) as total
       FROM invoices
       JOIN jobs ON jobs.id = invoices.job_id
       WHERE invoices.status = 'paid'
       GROUP BY jobs.service
       ORDER BY total DESC`
    )
    .all() as RevenueByService[];
}

export interface MonthlyRevenue {
  month: string;
  total: number;
}

export function revenueTrend(months = 6): MonthlyRevenue[] {
  const rows = db
    .prepare(
      `SELECT strftime('%Y-%m', paid_date) as month, SUM(amount) as total
       FROM invoices
       WHERE status = 'paid' AND paid_date >= date('now', '-' || ? || ' months')
       GROUP BY month
       ORDER BY month ASC`
    )
    .all(months) as MonthlyRevenue[];

  const map = new Map(rows.map((r) => [r.month, r.total]));
  const out: MonthlyRevenue[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    out.push({ month: key, total: map.get(key) ?? 0 });
  }
  return out;
}

export function recentActivity(limit = 10): ActivityLogEntry[] {
  return db
    .prepare("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?")
    .all(limit) as ActivityLogEntry[];
}
