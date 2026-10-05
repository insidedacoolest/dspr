import { Anton, Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import "./admin.css";
import { getSession } from "../lib/session";
import { getSettings } from "../lib/settings";
import { logout } from "../actions/auth";
import { prisma } from "../lib/db";
import AdminNav from "./AdminNav";
import Logo, { brandProps } from "../components/Logo";

const fontDisplay = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const fontCond = Barlow_Condensed({ variable: "--font-cond", weight: ["600", "800"], style: ["normal", "italic"], subsets: ["latin"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata = {
  title: "Admin — D-Spare Garage",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getSession();
  const settings = await getSettings();
  let badges = {};
  if (session?.userId) {
    const [bookings, orders] = await Promise.all([
      prisma.booking.count({ where: { status: "new" } }),
      prisma.order.count({ where: { status: "paid" } }),
    ]);
    badges = { bookings, orders };
  }

  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontCond.variable} ${fontBody.variable}`}>
      <body className="admin-body">
        {!session?.userId ? (
          children
        ) : (
          <div className="admin-shell">
            <aside className="admin-sidebar">
              <Link href="/admin" className="admin-brand"><Logo brand={brandProps(settings)} size="sm" /></Link>
              <div className="admin-sidebar-sub">Admin panel</div>
              <AdminNav badges={badges} />
              <div className="admin-sidebar-foot">
                <Link href="/" target="_blank">View site ↗</Link>
                <span className="hint" style={{ padding: "0 .7rem" }}>{session.email}</span>
                <form action={logout}><button type="submit">Log out</button></form>
              </div>
            </aside>
            <div className="admin-main">{children}</div>
          </div>
        )}
      </body>
    </html>
  );
}
