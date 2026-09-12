import { db, logActivity } from "@/lib/db";
import type { Invoice, InvoiceStatus } from "@/lib/types";

export interface InvoiceWithCustomer extends Invoice {
  customer_name: string;
  service?: string;
}

export function listInvoices(): InvoiceWithCustomer[] {
  return db
    .prepare(
      `SELECT invoices.*, customers.name as customer_name, jobs.service as service
       FROM invoices
       JOIN customers ON customers.id = invoices.customer_id
       LEFT JOIN jobs ON jobs.id = invoices.job_id
       ORDER BY invoices.issued_date DESC`
    )
    .all() as InvoiceWithCustomer[];
}

export function getInvoice(id: number): InvoiceWithCustomer | undefined {
  return db
    .prepare(
      `SELECT invoices.*, customers.name as customer_name, jobs.service as service
       FROM invoices
       JOIN customers ON customers.id = invoices.customer_id
       LEFT JOIN jobs ON jobs.id = invoices.job_id
       WHERE invoices.id = ?`
    )
    .get(id) as InvoiceWithCustomer | undefined;
}

export function invoicesByCustomer(customerId: number): Invoice[] {
  return db
    .prepare("SELECT * FROM invoices WHERE customer_id = ? ORDER BY issued_date DESC")
    .all(customerId) as Invoice[];
}

export function createInvoice(data: {
  job_id?: number | null;
  customer_id: number;
  amount: number;
  notes?: string;
}): number {
  const result = db
    .prepare(
      `INSERT INTO invoices (job_id, customer_id, amount, notes, status)
       VALUES (?, ?, ?, ?, 'unpaid')`
    )
    .run(data.job_id ?? null, data.customer_id, data.amount, data.notes || null);
  const id = Number(result.lastInsertRowid);
  logActivity("invoice", id, `Invoice created for $${data.amount.toFixed(2)}`);
  return id;
}

export function updateInvoiceStatus(id: number, status: InvoiceStatus) {
  const paidDate = status === "paid" ? "datetime('now')" : "NULL";
  db.prepare(
    `UPDATE invoices SET status = ?, paid_date = ${paidDate} WHERE id = ?`
  ).run(status, id);
  logActivity("invoice", id, `Invoice marked ${status}`);
}

export function deleteInvoice(id: number) {
  db.prepare("DELETE FROM invoices WHERE id = ?").run(id);
}

export function outstandingBalance(): number {
  const row = db
    .prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status IN ('unpaid', 'overdue')"
    )
    .get() as { total: number };
  return row.total;
}

export function markOverdueInvoices() {
  db.prepare(
    `UPDATE invoices SET status = 'overdue'
     WHERE status = 'unpaid' AND date(issued_date) <= date('now', '-30 day')`
  ).run();
}
