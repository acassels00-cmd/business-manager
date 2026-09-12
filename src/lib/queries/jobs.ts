import { db, logActivity } from "@/lib/db";
import type { Job, JobStatus } from "@/lib/types";

export interface JobWithCustomer extends Job {
  customer_name: string;
}

export function listJobs(): JobWithCustomer[] {
  return db
    .prepare(
      `SELECT jobs.*, customers.name as customer_name
       FROM jobs JOIN customers ON customers.id = jobs.customer_id
       ORDER BY jobs.scheduled_date DESC`
    )
    .all() as JobWithCustomer[];
}

export function getJob(id: number): JobWithCustomer | undefined {
  return db
    .prepare(
      `SELECT jobs.*, customers.name as customer_name
       FROM jobs JOIN customers ON customers.id = jobs.customer_id
       WHERE jobs.id = ?`
    )
    .get(id) as JobWithCustomer | undefined;
}

export function jobsByCustomer(customerId: number): Job[] {
  return db
    .prepare("SELECT * FROM jobs WHERE customer_id = ? ORDER BY scheduled_date DESC")
    .all(customerId) as Job[];
}

export function upcomingJobs(limit = 8): JobWithCustomer[] {
  return db
    .prepare(
      `SELECT jobs.*, customers.name as customer_name
       FROM jobs JOIN customers ON customers.id = jobs.customer_id
       WHERE jobs.status IN ('scheduled','in_progress') AND jobs.scheduled_date >= date('now', '-1 day')
       ORDER BY jobs.scheduled_date ASC
       LIMIT ?`
    )
    .all(limit) as JobWithCustomer[];
}

export function createJob(data: {
  customer_id: number;
  lead_id?: number | null;
  service: string;
  scheduled_date: string;
  price: number;
  notes?: string;
}): number {
  const result = db
    .prepare(
      `INSERT INTO jobs (customer_id, lead_id, service, scheduled_date, price, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`
    )
    .run(
      data.customer_id,
      data.lead_id ?? null,
      data.service,
      data.scheduled_date,
      data.price,
      data.notes || null
    );
  const id = Number(result.lastInsertRowid);
  logActivity("job", id, `Job scheduled: ${data.service} on ${data.scheduled_date}`);
  return id;
}

export function updateJob(
  id: number,
  data: {
    service: string;
    scheduled_date: string;
    price: number;
    notes?: string;
  }
) {
  db.prepare(
    "UPDATE jobs SET service = ?, scheduled_date = ?, price = ?, notes = ? WHERE id = ?"
  ).run(data.service, data.scheduled_date, data.price, data.notes || null, id);
}

export function updateJobStatus(id: number, status: JobStatus) {
  const completedAt = status === "completed" ? "datetime('now')" : "NULL";
  db.prepare(
    `UPDATE jobs SET status = ?, completed_at = ${completedAt} WHERE id = ?`
  ).run(status, id);
  logActivity("job", id, `Job status changed to ${status}`);
}

export function deleteJob(id: number) {
  db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
}

export function jobsCompletedThisMonth(): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) as c FROM jobs
       WHERE status = 'completed' AND strftime('%Y-%m', completed_at) = strftime('%Y-%m', 'now')`
    )
    .get() as { c: number };
  return row.c;
}

export function averageJobValue(): number {
  const row = db
    .prepare(
      "SELECT COALESCE(AVG(price), 0) as avg FROM jobs WHERE status = 'completed'"
    )
    .get() as { avg: number };
  return row.avg;
}
