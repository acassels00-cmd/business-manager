"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/queries/customers";
import {
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
} from "@/lib/queries/leads";
import type { LeadStatus } from "@/lib/types";

export async function createCustomerAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) redirect("/crm/customers/new?error=Name is required");

  const id = createCustomer({
    name,
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    address: String(formData.get("address") || ""),
    notes: String(formData.get("notes") || ""),
  });

  revalidatePath("/crm/customers");
  const redirectTo = String(formData.get("redirect_to") || `/crm/customers/${id}`);
  redirect(redirectTo);
}

export async function updateCustomerAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  if (!name || !id) return;

  updateCustomer(id, {
    name,
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    address: String(formData.get("address") || ""),
    notes: String(formData.get("notes") || ""),
  });

  revalidatePath(`/crm/customers/${id}`);
  redirect(`/crm/customers/${id}`);
}

export async function deleteCustomerAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  deleteCustomer(id);
  revalidatePath("/crm/customers");
  redirect("/crm/customers");
}

export async function createLeadAction(formData: FormData) {
  const customerId = Number(formData.get("customer_id"));
  const service = String(formData.get("service") || "");
  const estimatedValue = Number(formData.get("estimated_value") || 0);
  if (!customerId || !service) redirect("/crm/leads/new?error=Missing fields");

  createLead({
    customer_id: customerId,
    service,
    estimated_value: estimatedValue,
    source: String(formData.get("source") || ""),
    notes: String(formData.get("notes") || ""),
  });

  revalidatePath("/crm");
  redirect("/crm");
}

export async function updateLeadAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const service = String(formData.get("service") || "");
  const estimatedValue = Number(formData.get("estimated_value") || 0);
  if (!id || !service) return;

  updateLead(id, {
    service,
    estimated_value: estimatedValue,
    source: String(formData.get("source") || ""),
    notes: String(formData.get("notes") || ""),
  });

  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
  redirect(`/crm/leads/${id}`);
}

export async function updateLeadStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "") as LeadStatus;
  if (!id || !status) return;
  updateLeadStatus(id, status);
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
  revalidatePath("/");
}

export async function deleteLeadAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  deleteLead(id);
  revalidatePath("/crm");
  redirect("/crm");
}
