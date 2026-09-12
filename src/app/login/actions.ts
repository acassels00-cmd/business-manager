"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, createSessionToken, getAppPassword } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/");

  if (password !== getAppPassword()) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE !== "false",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next && next.startsWith("/") ? next : "/");
}
