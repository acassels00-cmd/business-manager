import { db, logActivity } from "@/lib/db";
import type { Customer } from "@/lib/types";

export function listCustomers(): Customer[] {
  return db
    .prepare("SELECT * FROM customers ORDER BY name COLLATE NOCASE ASC")
    .all() as Customer[];
}

export function getCustomer(id: number): Customer | undefined {
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(id) as
    | Customer
    | undefined;
}

export function searchCustomers(query: string): Customer[] {
  return db
    .prepare(
      `SELECT * FROM customers
       WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
       ORDER BY name COLLATE NOCASE ASC`
    )
    .all(`%${query}%`, `%${query}%`, `%${query}%`) as Customer[];
}

export function createCustomer(data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}): number {
  const result = db
    .prepare(
      "INSERT INTO customers (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)"
    )
    .run(
      data.name,
      data.email || null,
      data.phone || null,
      data.address || null,
      data.notes || null
    );
  const id = Number(result.lastInsertRowid);
  logActivity("customer", id, `Customer "${data.name}" added`);
  return id;
}

export function updateCustomer(
  id: number,
  data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  }
) {
  db.prepare(
    "UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, notes = ? WHERE id = ?"
  ).run(
    data.name,
    data.email || null,
    data.phone || null,
    data.address || null,
    data.notes || null,
    id
  );
}

export function deleteCustomer(id: number) {
  db.prepare("DELETE FROM customers WHERE id = ?").run(id);
}

export function customerRevenue(id: number): number {
  const row = db
    .prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE customer_id = ? AND status = 'paid'"
    )
    .get(id) as { total: number };
  return row.total;
}

export function topCustomersByRevenue(limit = 5) {
  return db
    .prepare(
      `SELECT c.id, c.name, COALESCE(SUM(i.amount), 0) as total
       FROM customers c
       LEFT JOIN invoices i ON i.customer_id = c.id AND i.status = 'paid'
       GROUP BY c.id
       HAVING total > 0
       ORDER BY total DESC
       LIMIT ?`
    )
    .all(limit) as { id: number; name: string; total: number }[];
}
