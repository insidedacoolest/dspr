"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import { useCart } from "./CartContext";

const NAV = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About" },
  { href: "/drift", label: "Team" },
  { href: "/garage", label: "Garage" },
  { href: "/shop", label: "Shop" },
  { href: "/drift#events", label: "Events", hash: true },
  { href: "/news", label: "News" },
  { href: "/garage#book", label: "Contact", hash: true },
];

export default function Header({ brand }) {
  const pathname = usePathname();
  const { totalQty, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const isActive = (item) => !item.hash && (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <header className={`site-header${stuck ? " stuck" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="header-inner">
        <Link href="/" aria-label={`${brand?.brandFull || "D-Spare Garage"} — home`} onClick={close}>
          <Logo brand={brand} />
        </Link>

        <nav className="main-nav" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className={isActive(item) ? "active" : ""} onClick={close}>
              {item.label}
            </Link>
          ))}
          <Link href="/garage#book" className="nav-mobile-cta" onClick={close}>» Book the shop</Link>
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-btn" onClick={() => setOpen(true)} aria-label={`Open cart (${totalQty})`}>
            <Icon name="cart" />
            {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
          </button>
          <Link href="/drift#events" className="chev header-cta" onClick={close}><i aria-hidden="true">»</i><span>Upcoming events</span></Link>
          <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
