"use server";

import { revalidatePath } from "next/cache";
import {
  createService,
  updateService,
  deleteService,
} from "@/lib/queries/services";
import { setSetting } from "@/lib/queries/settings";

export async function updateBusinessProfileAction(formData: FormData) {
  setSetting("business_name", String(formData.get("business_name") || ""));
  setSetting("business_phone", String(formData.get("business_phone") || ""));
  setSetting("business_email", String(formData.get("business_email") || ""));
  setSetting("business_address", String(formData.get("business_address") || ""));
  revalidatePath("/settings");
}

export async function createServiceAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const basePrice = Number(formData.get("base_price") || 0);
  if (!name) return;
  createService({
    name,
    base_price: basePrice,
    description: String(formData.get("description") || ""),
  });
  revalidatePath("/settings");
}

export async function updateServiceAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const basePrice = Number(formData.get("base_price") || 0);
  if (!id || !name) return;
  updateService(id, {
    name,
    base_price: basePrice,
    description: String(formData.get("description") || ""),
    active: formData.get("active") === "on",
  });
  revalidatePath("/settings");
}

export async function deleteServiceAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  deleteService(id);
  revalidatePath("/settings");
}
