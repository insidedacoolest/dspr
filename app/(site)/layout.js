import Link from "next/link";
import { Anton, Barlow_Condensed, Inter } from "next/font/google";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { CartProvider } from "../components/CartContext";
import { brandProps } from "../components/Logo";
import { getSettings } from "../lib/settings";
import { prisma } from "../lib/db";
import { fmtDate } from "../lib/format";

const fontDisplay = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const fontCond = Barlow_Condensed({ variable: "--font-cond", weight: ["600", "800"], style: ["normal", "italic"], subsets: ["latin"] });
const fontBody = Inter({ variable: "--font-body", subsets: ["latin"] });

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.siteTitle, description: s.siteDescription };
}

async function Topbar({ text }) {
  if (text?.trim().toLowerCase() === "off") return null;
  if (text?.trim()) return <div className="topbar">{text}</div>;
  const next = await prisma.event.findFirst({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" } });
  if (!next) return null;
  return (
    <div className="topbar">
      <Link href="/drift#events">Next up · {next.title} — <b>{fmtDate(next.date)}</b> · {next.location}</Link>
    </div>
  );
}

export default async function SiteLayout({ children }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontCond.variable} ${fontBody.variable}`}>
      <body>
        <CartProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <Topbar text={settings.topbarText} />
          <Header brand={brandProps(settings)} />
          <main id="main">{children}</main>
          <Footer settings={settings} />
          <CartDrawer note={settings.checkoutNote} />
        </CartProvider>
      </body>
    </html>
  );
}
