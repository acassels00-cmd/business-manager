export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type InvoiceStatus = "unpaid" | "paid" | "overdue";

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export interface Lead {
  id: number;
  customer_id: number;
  service: string;
  status: LeadStatus;
  estimated_value: number;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  customer_id: number;
  lead_id: number | null;
  service: string;
  status: JobStatus;
  scheduled_date: string;
  price: number;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Invoice {
  id: number;
  job_id: number | null;
  customer_id: number;
  amount: number;
  status: InvoiceStatus;
  issued_date: string;
  paid_date: string | null;
  notes: string | null;
}

export interface Service {
  id: number;
  name: string;
  base_price: number;
  description: string | null;
  active: number;
}

export interface ActivityLogEntry {
  id: number;
  entity_type: string;
  entity_id: number;
  message: string;
  created_at: string;
}

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

export const JOB_STATUSES: JobStatus[] = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

export const INVOICE_STATUSES: InvoiceStatus[] = ["unpaid", "paid", "overdue"];

export const STATUS_LABEL: Record<string, string> = {
  new: "New Lead",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  unpaid: "Unpaid",
  paid: "Paid",
  overdue: "Overdue",
};
