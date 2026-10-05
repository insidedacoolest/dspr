import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { parsePairs } from "../../lib/content";
import { usd } from "../../lib/format";
import Icon from "../../components/Icon";
import Cta from "../../components/Cta";
import PageHead from "../../components/PageHead";
import BookingForm from "../../components/BookingForm";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSettings();
  return { title: `Garage — ${s.brandFull}`, description: s.garageLede };
}

export default async function GaragePage() {
  const [s, services] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
  ]);
  const steps = parsePairs(s.processSteps);
  const phone = s.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHead crumb="Garage" eyebrow={s.brandFull} title="Race" outline="shop" lede={s.garageLede} image={s.garageImage} ghost="Shop">
        <div className="ctas" style={{ marginTop: 30 }}>
          <Cta href="#book">Book the shop</Cta>
          <Cta href="#services" tone="white">Services</Cta>
        </div>
      </PageHead>

      <section className="sec grey" id="services">
        <div className="wrap">
          <div className="sec-head">
            <div><span className="eyebrow">What we do</span><h2 className="disp">Services</h2></div>
            <p>Starting prices — the final quote depends on the car and the parts.</p>
          </div>
          <div className="svc-grid">
            {services.map((sv, i) => (
              <article key={sv.id} className={`svc${sv.featured ? " featured" : ""}`}>
                <span className="num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ico"><Icon name={sv.icon} size={30} /></span>
                <h3>{sv.name}</h3>
                <p>{sv.description}</p>
                <div className="meta"><span>{sv.duration || "—"}</span><b>{sv.priceFrom ? `from ${usd(sv.priceFrom)}` : "Get a quote"}</b></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="sec dark">
          <div className="wrap">
            <div className="sec-head">
              <div><span className="eyebrow teal">Process</span><h2 className="disp">How we <span className="o-teal">work</span></h2></div>
            </div>
            <div className="steps">
              {steps.map((st, i) => (
                <div className="step" key={st.title}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sec grey" id="book">
        <div className="wrap booking">
          <div>
            <span className="eyebrow">Booking</span>
            <h2 className="disp">{s.bookingTitle}</h2>
            <p className="lede">{s.bookingText}</p>
            <div className="contact-list">
              <a href={`tel:${phone}`}><Icon name="phone" size={20} />{s.phone}</a>
              <a href={`mailto:${s.email}`}><Icon name="mail" size={20} />{s.email}</a>
              <a href={s.mapUrl} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={20} />{s.address}, {s.city}</a>
              <span><Icon name="clock" size={20} />{s.hours}</span>
            </div>
          </div>
          <div className="form-panel">
            <BookingForm services={services.map((sv) => ({ id: sv.id, name: sv.name }))} />
          </div>
        </div>
      </section>
    </>
  );
}
