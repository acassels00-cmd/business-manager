# Gator Wash Solutions — Business Manager

A private, self-hosted business management app built for Gator Wash Solutions
(pressure washing, window cleaning, soft washing, and roof cleaning). It covers
the day-to-day running of the business in one place:

- **Dashboard** — revenue this month, jobs completed, active leads & win rate,
  outstanding balance, average job value, revenue trend, revenue by service,
  upcoming jobs, and a recent activity feed.
- **CRM** — a lead pipeline (New → Contacted → Quoted → Won/Lost), a customer
  directory with search, and full customer profiles (contact info, job
  history, lead history, invoice history, lifetime revenue).
- **Jobs & Schedule** — every job, filterable by status, with a form to
  schedule new work and update status (Scheduled → In Progress → Completed →
  Cancelled).
- **Invoices** — create an invoice from a completed job, track unpaid /
  overdue / paid status, and see outstanding balance and total collected.
- **Reports** — lead funnel, revenue by service, 12-month revenue trend, and
  top customers by lifetime revenue.
- **Settings** — manage your business profile and the price list for each
  service.

The app comes seeded with your four services (Pressure Washing, Window
Cleaning, Soft Washing, Roof Cleaning) and their typical starting prices —
edit these any time in Settings.

## Tech stack

- **Next.js 16** (App Router, Server Actions) + React 19 + TypeScript
- **SQLite** (via `better-sqlite3`) — a single file database, no external
  database server to manage
- **Tailwind CSS** for styling
- **Recharts** for the dashboard/report charts

Everything runs in one process. Your data lives in `data/gatorwash.db`,
created automatically the first time the app starts.

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The default password is `gatorwash` — **change
this before you rely on the app** (see Configuration below).

## Configuration

Set these as environment variables (a `.env.local` file works for local
development):

| Variable | Purpose | Default |
|---|---|---|
| `APP_PASSWORD` | The password to sign in with. | `gatorwash` |
| `APP_SECRET` | Secret used to sign session cookies. Set this to a long random string in production. | falls back to `APP_PASSWORD` |
| `COOKIE_SECURE` | Set to `false` only if you are serving the app over plain HTTP (e.g. testing on `localhost` without HTTPS, or self-hosting behind a proxy that doesn't forward HTTPS). Leave unset/`true` for any real deployment. | `true` |

Example `.env.local`:

```
APP_PASSWORD=change-me-to-something-only-you-know
APP_SECRET=a-long-random-string
```

## Deploying

This is a normal Node.js app (`npm run build` + `npm run start`), so it runs
on any platform that runs Node: a small VPS, Railway, Render, Fly.io, etc.

Important: because data is stored in a local SQLite file (`data/`), the app
needs **persistent disk** — a platform that wipes the filesystem between
deploys (or runs multiple ephemeral instances) will lose your data. Use a
platform with a persistent volume, or point it at a mounted disk. Take
regular backups by copying the `data/gatorwash.db` file somewhere safe.

```bash
npm install
npm run build
npm run start
```

## Notes on the data model

- **Leads** move through a pipeline: New → Contacted → Quoted → Won/Lost.
- **Jobs** are scheduled work, optionally linked back to the lead that
  generated them. Marking a job Completed timestamps it for KPI purposes.
- **Invoices** are created from a job and track unpaid/overdue/paid status.
  An invoice unpaid for 30+ days is automatically flagged overdue.
- All of this is editable from **Settings → Services & pricing** and each
  entity's own detail page — nothing is hardcoded beyond the initial seed.
