import { db, logActivity } from "@/lib/db";
import type { Lead, LeadStatus } from "@/lib/types";

export interface LeadWithCustomer extends Lead {
  customer_name: string;
}

export function listLeads(): LeadWithCustomer[] {
  return db
    .prepare(
      `SELECT leads.*, customers.name as customer_name
       FROM leads
       JOIN customers ON customers.id = leads.customer_id
       ORDER BY leads.created_at DESC`
    )
    .all() as LeadWithCustomer[];
}

export function getLead(id: number): LeadWithCustomer | undefined {
  return db
    .prepare(
      `SELECT leads.*, customers.name as customer_name
       FROM leads JOIN customers ON customers.id = leads.customer_id
       WHERE leads.id = ?`
    )
    .get(id) as LeadWithCustomer | undefined;
}

export function createLead(data: {
  customer_id: number;
  service: string;
  estimated_value: number;
  source?: string;
  notes?: string;
}): number {
  const result = db
    .prepare(
      `INSERT INTO leads (customer_id, service, estimated_value, source, notes, status)
       VALUES (?, ?, ?, ?, ?, 'new')`
    )
    .run(
      data.customer_id,
      data.service,
      data.estimated_value,
      data.source || null,
      data.notes || null
    );
  const id = Number(result.lastInsertRowid);
  logActivity("lead", id, `New lead created for ${data.service}`);
  return id;
}

export function updateLeadStatus(id: number, status: LeadStatus) {
  db.prepare(
    "UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, id);
  logActivity("lead", id, `Lead status changed to ${status}`);
}

export function updateLead(
  id: number,
  data: {
    service: string;
    estimated_value: number;
    source?: string;
    notes?: string;
  }
) {
  db.prepare(
    `UPDATE leads SET service = ?, estimated_value = ?, source = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    data.service,
    data.estimated_value,
    data.source || null,
    data.notes || null,
    id
  );
}

export function deleteLead(id: number) {
  db.prepare("DELETE FROM leads WHERE id = ?").run(id);
}

export function leadsByCustomer(customerId: number): Lead[] {
  return db
    .prepare("SELECT * FROM leads WHERE customer_id = ? ORDER BY created_at DESC")
    .all(customerId) as Lead[];
}

export function leadFunnelCounts(): Record<LeadStatus, number> {
  const rows = db
    .prepare("SELECT status, COUNT(*) as c FROM leads GROUP BY status")
    .all() as { status: LeadStatus; c: number }[];
  const base: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    quoted: 0,
    won: 0,
    lost: 0,
  };
  for (const row of rows) base[row.status] = row.c;
  return base;
}

export function conversionRate(): number {
  const row = db
    .prepare(
      `SELECT
        SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as won,
        SUM(CASE WHEN status IN ('won','lost') THEN 1 ELSE 0 END) as decided
       FROM leads`
    )
    .get() as { won: number; decided: number };
  if (!row.decided) return 0;
  return row.won / row.decided;
}
