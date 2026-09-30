import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSessionToken } from "./admin-session";

// Server-side guards for everything under /admin.
//
// middleware.ts already bounces logged-out visitors away from /admin
// pages, but server actions are just POST endpoints — so every action and
// admin page ALSO checks the session itself. Never rely on one layer.

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

// For admin pages: sends logged-out visitors to the login screen.
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

// For server actions: throws instead of redirecting, so a forged request
// gets an error and nothing is written.
export async function requireAdminAction(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorised — please log in again.");
  }
}
