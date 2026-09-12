"use server";

import { revalidatePath } from "next/cache";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/queries/invoices";
import type { InvoiceStatus } from "@/lib/types";

export async function updateInvoiceStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "") as InvoiceStatus;
  if (!id || !status) return;
  updateInvoiceStatus(id, status);
  revalidatePath("/invoices");
  revalidatePath("/");
}

export async function deleteInvoiceAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  deleteInvoice(id);
  revalidatePath("/invoices");
}
