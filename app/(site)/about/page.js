import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { paragraphs, parsePairs } from "../../lib/content";
import Media from "../../components/Media";
import Cta from "../../components/Cta";
import PageHead from "../../components/PageHead";
import DriverBlock from "../../components/DriverBlock";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return { title: `${s.aboutTitle} — ${s.brandFull}`, description: s.aboutLede };
}

export default async function AboutPage() {
  const [s, milestones, lead] = await Promise.all([
    getSettings(),
    prisma.milestone.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    prisma.driver.findFirst({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);
  const values = parsePairs(s.values);
  const founder = lead
    ? { ...lead, name: s.founderName || lead.name, role: s.founderRole || lead.role, bio: s.founderBio || lead.bio, imageUrl: s.founderImage || lead.imageUrl }
    : null;

  return (
    <>
      <PageHead crumb="About" eyebrow={s.brandFull} title={s.aboutTitle} lede={s.aboutLede} image={s.aboutImage} ghost={s.brandName} />

      <section className="sec">
        <div className="wrap story">
          <div className="story-img"><Media src={s.aboutImage} alt={s.brandFull} label={s.brandName} light /></div>
          <div className="story-text">
            <span className="eyebrow">Our story</span>
            <h2 className="disp">{s.aboutStoryTitle}</h2>
            {paragraphs(s.aboutStory).map((p, i) => <p key={i}>{p}</p>)}
            {s.aboutQuote && <blockquote className="quote">{s.aboutQuote}<cite>— {s.founderName}</cite></blockquote>}
          </div>
        </div>
      </section>

      {founder && (
        <section className="sec dark" style={{ padding: 0 }}>
          <DriverBlock driver={founder} />
        </section>
      )}

      {values.length > 0 && (
        <section className="sec dark">
          <div className="wrap">
            <div className="sec-head">
              <div><span className="eyebrow teal">What drives us</span><h2 className="disp">{s.valuesTitle}</h2></div>
            </div>
            <div className="values">
              {values.map((v, i) => (
                <article className="value" key={v.title}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{v.title}</h3>
                  {v.text && <p>{v.text}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {milestones.length > 0 && (
        <section className="sec grey">
          <div className="wrap">
            <div className="sec-head">
              <div><span className="eyebrow">Timeline</span><h2 className="disp">{s.timelineTitle}</h2></div>
            </div>
            <div className="timeline">
              {milestones.map((m) => (
                <div className="tl" key={m.id}>
                  <span className="y">{m.year}</span>
                  <div><h3>{m.title}</h3>{m.text && <p>{m.text}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="join">
        <div className="wrap">
          <h2 className="disp">Visit<br /><span className="o-white">the</span> shop</h2>
          <p>{s.address}, {s.city} · {s.hours}</p>
          <div className="ctas">
            <Cta href="/garage#book" tone="dark">Book the shop</Cta>
            {s.mapUrl && <Cta href={s.mapUrl} tone="white">Get directions</Cta>}
          </div>
        </div>
      </section>
    </>
  );
}
