import Link from "next/link";
import Logo, { brandProps } from "./Logo";
import Icon from "./Icon";

export default function Footer({ settings: s }) {
  const phone = s.phone.replace(/[^\d+]/g, "");
  return (
    <>
      <div className="stripe" aria-hidden="true" />
      <footer className="site-footer">
        <div className="wrap">
          <div className="f-grid">
            <div>
              <Logo brand={brandProps(s)} size="lg" />
              <p>{s.footerBlurb}</p>
            </div>
            <div>
              <h4>Team</h4>
              <Link href="/about">About</Link>
              <Link href="/drift#drivers">Drivers</Link>
              <Link href="/drift#events">Events</Link>
              <Link href="/news">News</Link>
            </div>
            <div>
              <h4>Shop & garage</h4>
              <Link href="/shop?s=merch">Team gear</Link>
              <Link href="/shop?s=parts">Parts</Link>
              <Link href="/garage">Services</Link>
              <Link href="/garage#book">Book the shop</Link>
            </div>
            <div>
              <h4>Follow the {s.brandName} team</h4>
              <a href={s.mapUrl || "#"} target="_blank" rel="noopener noreferrer">{s.address}, {s.city}</a>
              <a href={`tel:${phone}`}>{s.phone}</a>
              <a href={`mailto:${s.email}`}>{s.email}</a>
              <div className="social">
                {s.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={20} /></a>}
                {s.youtube && <a href={s.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Icon name="youtube" size={20} /></a>}
                {s.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" size={20} /></a>}
              </div>
            </div>
          </div>
          <div className="f-bot">
            <span>© {new Date().getFullYear()} {s.brandFull}. All rights reserved.</span>
            <span>{s.hours}</span>
            <Link href="/admin">Staff login</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
