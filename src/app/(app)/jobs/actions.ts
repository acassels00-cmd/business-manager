"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createJob, updateJob, updateJobStatus, deleteJob } from "@/lib/queries/jobs";
import { createInvoice } from "@/lib/queries/invoices";
import type { JobStatus } from "@/lib/types";

export async function createJobAction(formData: FormData) {
  const customerId = Number(formData.get("customer_id"));
  const service = String(formData.get("service") || "");
  const scheduledDate = String(formData.get("scheduled_date") || "");
  const price = Number(formData.get("price") || 0);
  const leadIdRaw = formData.get("lead_id");
  if (!customerId || !service || !scheduledDate) {
    redirect("/jobs/new?error=Missing fields");
  }

  const id = createJob({
    customer_id: customerId,
    lead_id: leadIdRaw ? Number(leadIdRaw) : null,
    service,
    scheduled_date: scheduledDate,
    price,
    notes: String(formData.get("notes") || ""),
  });

  revalidatePath("/jobs");
  revalidatePath("/");
  redirect(`/jobs/${id}`);
}

export async function updateJobAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const service = String(formData.get("service") || "");
  const scheduledDate = String(formData.get("scheduled_date") || "");
  const price = Number(formData.get("price") || 0);
  if (!id || !service || !scheduledDate) return;

  updateJob(id, {
    service,
    scheduled_date: scheduledDate,
    price,
    notes: String(formData.get("notes") || ""),
  });

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  redirect(`/jobs/${id}`);
}

export async function updateJobStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "") as JobStatus;
  if (!id || !status) return;
  updateJobStatus(id, status);
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/");
}

export async function deleteJobAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  deleteJob(id);
  revalidatePath("/jobs");
  redirect("/jobs");
}

export async function createInvoiceFromJobAction(formData: FormData) {
  const jobId = Number(formData.get("job_id"));
  const customerId = Number(formData.get("customer_id"));
  const amount = Number(formData.get("amount") || 0);
  if (!jobId || !customerId || !amount) return;

  createInvoice({ job_id: jobId, customer_id: customerId, amount });
  revalidatePath("/invoices");
  revalidatePath(`/jobs/${jobId}`);
  redirect("/invoices");
}
