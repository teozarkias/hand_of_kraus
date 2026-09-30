"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isCorrectPassword,
} from "@/lib/admin-session";

export interface LoginState {
  success: boolean;
  message: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!(await isCorrectPassword(password))) {
    // Small fixed delay on every wrong guess makes brute-forcing the
    // password painfully slow, without bothering a real user.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: false, message: "Wrong password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true, // unreadable from JavaScript on the page
    secure: process.env.NODE_ENV === "production", // HTTPS-only when live
    sameSite: "lax",
    path: "/admin", // never sent along with normal shop page requests
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}
