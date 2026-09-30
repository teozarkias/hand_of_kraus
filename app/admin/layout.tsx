import type { Metadata } from "next";

// Keeps the admin panel out of Google and other search engines.
export const metadata: Metadata = {
  title: "Admin — Kraus",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
