// Admin login sessions — shared by middleware.ts (Edge runtime) and the
// server actions (Node runtime), so it only uses the Web Crypto API that
// both runtimes provide.
//
// How it works: after the right password is entered, the browser gets an
// httpOnly cookie holding "<expiry>.<signature>", where the signature is an
// HMAC of the expiry made with a server-only secret. Nobody can forge or
// extend that cookie without the secret, and the password itself is never
// stored in it. The signing key also mixes in the password, so changing
// ADMIN_PASSWORD instantly logs out every existing session.

export const ADMIN_COOKIE = "kraus_admin";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

const encoder = new TextEncoder();

function getSigningSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  // Fail closed: if either is missing, no session can ever be valid.
  if (!secret || secret.length < 32 || !password) return null;
  return `${secret}:${password}`;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

// Compares two equal-length strings without bailing out at the first
// mismatch, so response timing doesn't leak how much of a guess was right.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function isCorrectPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Hash both first so the comparison is always between equal-length
  // strings, whatever length the guess was.
  const [a, b] = await Promise.all([sha256Hex(input), sha256Hex(expected)]);
  return timingSafeEqual(a, b);
}

export async function createSessionToken(): Promise<string> {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error(
      "Admin login isn't configured: set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ characters). See ADMIN_SETUP.md.",
    );
  }
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  return `${expiresAt}.${await hmacHex(secret, String(expiresAt))}`;
}

export async function isValidSessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  const secret = getSigningSecret();
  if (!secret || !token) return false;

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!signature || !Number.isFinite(expiresAt)) return false;
  if (expiresAt < Math.floor(Date.now() / 1000)) return false;

  return timingSafeEqual(signature, await hmacHex(secret, expiresAtRaw));
}
