import Link from "next/link";
import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { productToView } from "../lib/views";
import { fmtDate, dateParts, usd } from "../lib/format";
import { eventKindLabel } from "../lib/constants";
import Media from "../components/Media";
import Icon from "../components/Icon";
import Cta from "../components/Cta";
import Countdown from "../components/Countdown";
import ProductCard from "../components/ProductCard";
import DriverBlock from "../components/DriverBlock";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();
  const [s, drivers, nextEvent, products, services, news, partners] = await Promise.all([
    getSettings(),
    prisma.driver.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    prisma.event.findFirst({ where: { date: { gte: now } }, orderBy: { date: "asc" } }),
    prisma.product.findMany({ orderBy: [{ featured: "desc" }, { id: "desc" }], take: 8 }),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }], take: 4 }),
    prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.partner.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);

  const lead = drivers[0];
  const stats = [1, 2, 3].map((n) => [s[`stat${n}Value`], s[`stat${n}Label`]]).filter(([v]) => v);
  const ev = nextEvent ? dateParts(nextEvent.date) : null;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <Media src={s.heroImage} alt="" className="fill" />
        <div className="slash" aria-hidden="true" />
        <div className="slash t" aria-hidden="true" />
        <div className="wrap">
          <span className="eyebrow teal">{s.heroKicker}</span>
          <h1 className="disp">
            {s.heroLine1}
            {s.heroLine2 && <><br /><span className="o-white">{s.heroLine2}</span></>}
            {s.heroBig && <> <span className="c-teal">{s.heroBig}</span></>}
          </h1>
          <p>{s.heroTagline}</p>
          <div className="ctas">
            {s.heroCta1 && <Cta href={s.instagram || "/about"}>{s.heroCta1}</Cta>}
            {s.heroCta2 && <Cta href="/garage#book" tone="white">{s.heroCta2}</Cta>}
          </div>
          <div className="hero-foot">
            <div className="stats">
              {stats.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}
            </div>
            <span className="scroll-hint">Scroll ↓</span>
          </div>
        </div>
      </section>

      {/* NEXT EVENT */}
      {nextEvent && (
        <section className="sec">
          <div className="wrap">
            <div className="ev">
              <div className="ev-panel">
                <span className="eyebrow">Upcoming</span>
                <h2 className="disp">Next<br /><span className="c-teal">event</span></h2>
                <div className="ev-date"><b>{ev.day}</b><span>{ev.month}<br />{ev.year}</span></div>
                <h3>{nextEvent.title}</h3>
                <p className="ev-loc"><Icon name="pin" size={16} />{nextEvent.location}</p>
                <Countdown target={nextEvent.date.toISOString()} />
                <Cta href="/drift#events" tone="pink">See all events</Cta>
              </div>
              <div className="ev-photo">
                <Media src={s.eventImage || s.heroImage} alt="" className="fill" label={eventKindLabel(nextEvent.kind)} />
                <span className="ev-flag">{eventKindLabel(nextEvent.kind)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TEAM */}
      {lead && (
        <section className="sec dark" style={{ paddingBottom: 0 }}>
          <div className="wrap sec-head">
            <div>
              <span className="eyebrow teal">The team</span>
              <h2 className="disp">{s.teamTitle1} <span className="o-teal">{s.teamTitle2}</span></h2>
            </div>
            <p>{s.teamText}</p>
          </div>
          {drivers.slice(0, 2).map((d, i) => <DriverBlock key={d.id} driver={d} flip={i % 2 === 1} />)}
        </section>
      )}

      {/* CAR */}
      {lead && (
        <section className="car">
          <div className="car-grid">
            <div className="car-text">
              <span className="eyebrow ink">The car · #{lead.num}</span>
              <h2 className="disp">{lead.car}</h2>
              <div className="specs">
                {lead.engine && <div><small>Engine</small>{lead.engine}</div>}
                {lead.power > 0 && <div><small>Power</small>{lead.power} hp</div>}
                {lead.specs.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, lead.power > 0 ? 2 : 3).map((x) => (
                  <div key={x}><small>Build</small>{x}</div>
                ))}
              </div>
              <Cta href={`/drift/${lead.slug}`} tone="dark">Full spec sheet</Cta>
            </div>
            <div className="car-img">
              <Media src={lead.carImageUrl || lead.imageUrl} alt={lead.car} label={lead.car} className="fill" />
              <span className="car-badge">Built at <b>{s.brandFull}</b></span>
            </div>
          </div>
        </section>
      )}

      {/* SHOP */}
      {products.length > 0 && (
        <section className="sec grey">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow">This is the official shop</span>
                <h2 className="disp">{s.shopTitle1} <span className="o-ink">{s.shopTitle2}</span></h2>
              </div>
              <Cta href="/shop" tone="dark">View all shop</Cta>
            </div>
            <div className="products">{products.map((p) => <ProductCard key={p.id} product={productToView(p)} />)}</div>
          </div>
        </section>
      )}

      {/* GARAGE */}
      <section className="garage-band">
        <div className="garage-grid">
          <div className="garage-img"><Media src={s.homeGarageImage || s.garageImage} alt="" label="Garage" className="fill" /></div>
          <div className="garage-text">
            <span className="eyebrow teal">{s.brandFull}</span>
            <h2 className="disp">{s.garageTitle1}<br /><span className="c-pink">{s.garageTitle2}</span></h2>
            {services.length > 0 && (
              <ul className="svc-list">
                {services.map((sv) => (
                  <li key={sv.id}><Link href="/garage#services">{sv.name} <small>{sv.priceFrom ? `from ${usd(sv.priceFrom)}` : "quote"}</small></Link></li>
                ))}
              </ul>
            )}
            <Cta href="/garage#book">Book the shop</Cta>
          </div>
        </div>
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section className="sec grey">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow">Latest</span>
                <h2 className="disp">{s.newsTitle}</h2>
              </div>
              <Cta href="/news" tone="dark">All news</Cta>
            </div>
            <div className="news-grid">
              {news.map((n, i) => (
                <Link href={`/news/${n.id}`} className={`post${i === 0 ? " lead" : ""}`} key={n.id}>
                  <div className="img"><Media src={n.imageUrl} alt={n.title} label={n.section} /><span className="tag">{n.section}</span></div>
                  <div className="post-body">
                    <time>{fmtDate(n.publishedAt)}</time>
                    <h3>{n.title}</h3>
                    <p>{n.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      {partners.length > 0 && (
        <section className="partners">
          <div className="wrap">
            <span className="eyebrow">Partners</span>
            <div className="row">
              {partners.map((p) => (
                <a key={p.id} href={p.link || "#"} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.logoUrl ? <img src={p.logoUrl} alt={p.name} /> : p.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JOIN */}
      <section className="join">
        <div className="wrap">
          <h2 className="disp">{s.joinTitle1}<br /><span className="o-white">{s.joinTitle2}</span> {s.joinTitle3}</h2>
          <p>{s.joinText}</p>
          <Cta href={s.instagram || "#"} tone="dark">{s.instaHandle}</Cta>
        </div>
      </section>
    </>
  );
}
