import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { youtubeId } from "../../lib/content";
import { dateParts } from "../../lib/format";
import { eventKindLabel } from "../../lib/constants";
import DriverBlock from "../../components/DriverBlock";
import Media from "../../components/Media";
import Cta from "../../components/Cta";
import PageHead from "../../components/PageHead";
import YouTube from "../../components/YouTube";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return { title: `Drift team — ${s.brandFull}`, description: s.driftLede };
}

function EventRow({ event, past }) {
  const p = dateParts(event.date);
  const Tag = event.link ? "a" : "div";
  const linkProps = event.link ? { href: event.link, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Tag className={`event-row${past ? " past" : ""}`} {...linkProps}>
      <span className="d">{p.day}<small>{p.month} {p.year}</small></span>
      <div>
        <h3>{event.title}</h3>
        <p>{event.location}{event.desc ? ` — ${event.desc}` : ""}</p>
      </div>
      <div className="side">
        {past && event.result ? <span className="result">{event.result}</span> : <span className={`badge ${past ? "" : "badge-teal"}`}>{eventKindLabel(event.kind)}</span>}
        {event.link && <span className="arrow-link">Info</span>}
      </div>
    </Tag>
  );
}

export default async function DriftPage() {
  const now = new Date();
  const [s, drivers, upcoming, past, gallery] = await Promise.all([
    getSettings(),
    prisma.driver.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    prisma.event.findMany({ where: { date: { gte: now } }, orderBy: { date: "asc" } }),
    prisma.event.findMany({ where: { date: { lt: now } }, orderBy: { date: "desc" }, take: 10 }),
    prisma.galleryImage.findMany({ where: { section: "drift" }, orderBy: [{ order: "asc" }, { id: "desc" }] }),
  ]);
  const video = youtubeId(s.videoId);
  const placeholders = ["Smoke", "Angle", "Tandem", "Crew", "Full lock", "Send it"];

  return (
    <>
      <PageHead crumb="Team" eyebrow="Pro drift team" title="Drift" outline="team" lede={s.driftLede} image={drivers[0]?.carImageUrl || s.heroImage} ghost="801">
        <div className="subnav">
          <a href="#drivers" className="chip">Drivers</a>
          <a href="#events" className="chip">Events</a>
          {video && <a href="#video" className="chip">Episodes</a>}
          <a href="#gallery" className="chip">Gallery</a>
          <a href="#sponsors" className="chip">Sponsors</a>
        </div>
      </PageHead>

      <section className="sec">
        <div className="wrap statement-grid">
          <p className="statement">{s.driftManifesto}</p>
          <div className="statement-side">
            <span className="eyebrow">Drift · Build · Repeat</span>
            <p>{s.driftSide}</p>
          </div>
        </div>
      </section>

      <section className="sec dark" id="drivers" style={{ paddingBottom: 0 }}>
        <div className="wrap sec-head">
          <div><span className="eyebrow teal">The team</span><h2 className="disp">Drivers <span className="o-teal">&</span> cars</h2></div>
          <p>{s.teamText}</p>
        </div>
        {drivers.map((d, i) => <DriverBlock key={d.id} driver={d} flip={i % 2 === 1} />)}
      </section>

      <section className="sec" id="events">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow">Season</span><h2 className="disp">Events <span className="o-ink">&</span> results</h2></div>
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="arrow-link">Updates on Instagram</a>
          </div>
          {upcoming.length === 0 ? (
            <p className="lede">No dates announced yet — follow us on Instagram for updates.</p>
          ) : (
            <div className="events">{upcoming.map((e) => <EventRow key={e.id} event={e} />)}</div>
          )}
          {past.length > 0 && (
            <>
              <h3 className="form-title" style={{ margin: "60px 0 18px" }}><em>{"//"}</em> In the books</h3>
              <div className="events">{past.map((e) => <EventRow key={e.id} event={e} past />)}</div>
            </>
          )}
        </div>
      </section>

      {video && (
        <section className="sec dark" id="video">
          <div className="wrap video-grid">
            <div>
              <span className="eyebrow teal">YouTube</span>
              <h2 className="disp">{s.videoTitle}</h2>
              <p className="lede light" style={{ marginBottom: 30 }}>{s.videoText}</p>
              <Cta href={s.youtube} tone="pink">Subscribe</Cta>
            </div>
            <YouTube id={video} title={s.videoTitle} />
          </div>
        </section>
      )}

      <section className="sec grey" id="gallery">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow">Trackside</span><h2 className="disp">Gallery</h2></div>
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="arrow-link">More on Instagram</a>
          </div>
          <div className="gallery">
            {gallery.length > 0
              ? gallery.map((g) => (
                  <figure key={g.id}>
                    <Media src={g.imageUrl} alt={g.caption} />
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                  </figure>
                ))
              : placeholders.map((label, i) => (
                  <figure key={label}><Media label={label} ratio={i % 3 === 0 ? "3 / 4" : i % 3 === 1 ? "4 / 3" : "1 / 1"} /></figure>
                ))}
          </div>
        </div>
      </section>

      <section className="join" id="sponsors">
        <div className="wrap">
          <span className="eyebrow ink">Sponsorship</span>
          <h2 className="disp" style={{ marginTop: 14 }}>{s.sponsorTitle}</h2>
          <p>{s.sponsorText}</p>
          <Cta href={`mailto:${s.email}?subject=Sponsorship — ${s.brandFull}`} tone="dark">Let’s talk</Cta>
        </div>
      </section>
    </>
  );
}
