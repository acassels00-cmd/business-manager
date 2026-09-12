import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "gatorwash.db");

declare global {
  // eslint-disable-next-line no-var
  var __gatorDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export const db = global.__gatorDb ?? createConnection();
if (!global.__gatorDb) global.__gatorDb = db;

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      service TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      estimated_value REAL NOT NULL DEFAULT 0,
      source TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
      service TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      scheduled_date TEXT NOT NULL,
      price REAL NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'unpaid',
      issued_date TEXT NOT NULL DEFAULT (datetime('now')),
      paid_date TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      base_price REAL NOT NULL DEFAULT 0,
      description TEXT,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_date ON jobs(scheduled_date);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
  `);

  const serviceCount = db
    .prepare("SELECT COUNT(*) as c FROM services")
    .get() as { c: number };

  if (serviceCount.c === 0) {
    const insert = db.prepare(
      "INSERT INTO services (name, base_price, description, active) VALUES (?, ?, ?, 1)"
    );
    insert.run(
      "Pressure Washing",
      175,
      "Driveways, sidewalks, patios, and hardscapes"
    );
    insert.run(
      "Window Cleaning",
      125,
      "Interior and exterior residential/commercial window cleaning"
    );
    insert.run(
      "Soft Washing",
      225,
      "Low-pressure house washing, siding, and delicate surfaces"
    );
    insert.run(
      "Roof Cleaning",
      395,
      "Soft wash roof cleaning to remove algae, moss, and stains"
    );
  }

  const businessName = db
    .prepare("SELECT value FROM settings WHERE key = 'business_name'")
    .get();
  if (!businessName) {
    const insertSetting = db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?)"
    );
    insertSetting.run("business_name", "Gator Wash Solutions");
    insertSetting.run("business_phone", "");
    insertSetting.run("business_email", "");
    insertSetting.run("business_address", "");
  }
}

init();

export function logActivity(
  entityType: string,
  entityId: number,
  message: string
) {
  db.prepare(
    "INSERT INTO activity_log (entity_type, entity_id, message) VALUES (?, ?, ?)"
  ).run(entityType, entityId, message);
}
