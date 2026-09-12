import { db } from "@/lib/db";
import type { Service } from "@/lib/types";

export function listServices(activeOnly = false): Service[] {
  if (activeOnly) {
    return db
      .prepare("SELECT * FROM services WHERE active = 1 ORDER BY name ASC")
      .all() as Service[];
  }
  return db.prepare("SELECT * FROM services ORDER BY name ASC").all() as Service[];
}

export function getService(id: number): Service | undefined {
  return db.prepare("SELECT * FROM services WHERE id = ?").get(id) as
    | Service
    | undefined;
}

export function createService(data: {
  name: string;
  base_price: number;
  description?: string;
}): number {
  const result = db
    .prepare(
      "INSERT INTO services (name, base_price, description, active) VALUES (?, ?, ?, 1)"
    )
    .run(data.name, data.base_price, data.description || null);
  return Number(result.lastInsertRowid);
}

export function updateService(
  id: number,
  data: { name: string; base_price: number; description?: string; active: boolean }
) {
  db.prepare(
    "UPDATE services SET name = ?, base_price = ?, description = ?, active = ? WHERE id = ?"
  ).run(data.name, data.base_price, data.description || null, data.active ? 1 : 0, id);
}

export function deleteService(id: number) {
  db.prepare("DELETE FROM services WHERE id = ?").run(id);
}
