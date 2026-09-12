export const SESSION_COOKIE = "gw_session";
const COOKIE_TAG = "authenticated";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return (
    process.env.APP_SECRET ||
    process.env.APP_PASSWORD ||
    "gator-wash-solutions-dev-secret"
  );
}

export function getAppPassword(): string {
  return process.env.APP_PASSWORD || "gatorwash";
}

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(sigBuf);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(): Promise<string> {
  const timestamp = String(Date.now());
  const payload = `${COOKIE_TAG}.${timestamp}`;
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tag, timestamp, sig] = parts;
  if (tag !== COOKIE_TAG) return false;
  const payload = `${tag}.${timestamp}`;
  const expected = await sign(payload);
  if (!timingSafeEqualStr(sig, expected)) return false;
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;
  return Date.now() - issuedAt < MAX_AGE_MS;
}
