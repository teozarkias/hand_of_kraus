import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <section className={styles.loginPage}>
      <span className={styles.eyebrow}>Admin</span>
      <h1 className={styles.title}>Studio login</h1>
      <LoginForm />
    </section>
  );
}
