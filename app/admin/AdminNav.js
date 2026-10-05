"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "../components/Icon";

const GROUPS = [
  { label: null, links: [{ href: "/admin", label: "Dashboard", icon: "gauge", exact: true }] },
  {
    label: "Garage",
    links: [
      { href: "/admin/bookings", label: "Bookings", icon: "clock", badge: "bookings" },
      { href: "/admin/services", label: "Services", icon: "wrench" },
    ],
  },
  {
    label: "Shop",
    links: [
      { href: "/admin/orders", label: "Orders", icon: "bag", badge: "orders" },
      { href: "/admin/products", label: "Products", icon: "cart" },
    ],
  },
  {
    label: "Drift",
    links: [
      { href: "/admin/drivers", label: "Drivers", icon: "steering" },
      { href: "/admin/events", label: "Calendar", icon: "flag" },
      { href: "/admin/gallery", label: "Gallery", icon: "instagram" },
    ],
  },
  {
    label: "Site",
    links: [
      { href: "/admin/content", label: "Site content", icon: "laptop" },
      { href: "/admin/milestones", label: "About timeline", icon: "pin" },
      { href: "/admin/news", label: "News", icon: "mail" },
      { href: "/admin/partners", label: "Partners", icon: "check" },
      { href: "/admin/settings", label: "Account", icon: "gear" },
    ],
  },
];

export default function AdminNav({ badges = {} }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav">
      {GROUPS.map((g, i) => (
        <div key={i} style={{ display: "contents" }}>
          {g.label && <div className="admin-nav-group">{g.label}</div>}
          {g.links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            const count = l.badge ? badges[l.badge] : 0;
            return (
              <Link key={l.href} href={l.href} className={active ? "active" : ""}>
                <span><Icon name={l.icon} size={17} />{l.label}</span>
                {count > 0 && <em className="pill">{count}</em>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
