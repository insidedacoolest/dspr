import Link from "next/link";
import Logo, { brandProps } from "../../components/Logo";
import { getSettings } from "../../lib/settings";
import LoginForm from "./LoginForm";

export const metadata = { title: "Log in — Admin" };

export default async function AdminLoginPage() {
  const s = await getSettings();
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link href="/"><Logo brand={brandProps(s)} size="lg" /></Link>
        <h1>Pit <em>lane</em></h1>
        <LoginForm />
      </div>
    </div>
  );
}
