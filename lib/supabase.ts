import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ART_BUCKET } from "./supabase-constants";

// The one bucket every uploaded artwork image lives in (created by
// supabase/schema.sql).
export { ART_BUCKET };

let adminClient: SupabaseClient | null = null;

// Server-only Supabase client using the secret service-role key. It
// bypasses row-level security, so it must never reach the browser —
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix, which means Next.js
// never bundles it into client code, and this throws if anything tries.
//
// Created lazily (on first use, not at import time) so a missing env var
// produces a clear error on the page that needs data, instead of crashing
// every module that happens to import this file.
export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() must only be called on the server.");
  }

  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase isn't configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see ADMIN_SETUP.md).",
    );
  }

  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

// Uploaded images are stored as full public URLs like
// https://<project>.supabase.co/storage/v1/object/public/art/<path>.
// Returns <path> for those, or null for the original /public images, so
// deleting a painting only ever removes files we actually uploaded.
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${ART_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}
