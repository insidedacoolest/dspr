import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import Media from "../../../components/Media";
import Cta from "../../../components/Cta";
import PageHead from "../../../components/PageHead";
import DriverBlock from "../../../components/DriverBlock";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await prisma.driver.findUnique({ where: { slug } });
  return { title: d ? `${d.name} — Drift team` : "Driver" };
}

export default async function DriverPage({ params }) {
  const { slug } = await params;
  const driver = await prisma.driver.findUnique({ where: { slug } });
  if (!driver) notFound();
  const others = await prisma.driver.findMany({ where: { id: { not: driver.id } }, orderBy: [{ order: "asc" }, { id: "asc" }], take: 2 });
  const specs = driver.specs.split("\n").map((x) => x.trim()).filter(Boolean);
  const [first, ...rest] = driver.name.split(" ");

  return (
    <>
      <PageHead crumb={`Team / ${driver.name}`} eyebrow={`#${driver.num} · ${driver.role}`} title={first} outline={rest.join(" ")} lede={driver.bio} image={driver.carImageUrl || driver.imageUrl} ghost={driver.num}>
        {driver.instagram && <div className="ctas" style={{ marginTop: 30 }}><Cta href={driver.instagram}>Follow on Instagram</Cta></div>}
      </PageHead>

      <section className="sec dark">
        <div className="wrap story">
          <div className="story-img"><Media src={driver.imageUrl} alt={driver.name} label={driver.num} /></div>
          <div>
            <span className="eyebrow teal">Spec sheet</span>
            <h2 className="disp" style={{ fontSize: "clamp(48px, 5.4vw, 88px)", margin: "14px 0 28px" }}>{driver.car}</h2>
            <table className="spec-table">
              <tbody>
                <tr><th>Driver</th><td>{driver.name}</td></tr>
                <tr><th>Number</th><td className="c-teal">#{driver.num}</td></tr>
                {driver.engine && <tr><th>Engine</th><td>{driver.engine}</td></tr>}
                {driver.power > 0 && (
                  <tr><th>Power</th><td>{driver.power} hp<div className="power-bar"><i style={{ width: `${Math.min(100, (driver.power / 1000) * 100)}%` }} /></div></td></tr>
                )}
                {specs.length > 0 && <tr><th>Build</th><td>{specs.map((x) => <div key={x}>{x}</div>)}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {driver.carImageUrl && (
        <section className="sec tight dark" style={{ paddingTop: 0 }}>
          <div className="wrap"><Media src={driver.carImageUrl} alt={driver.car} className="wide-img" /></div>
        </section>
      )}

      {others.length > 0 && (
        <section className="sec dark" style={{ paddingBottom: 0 }}>
          <div className="wrap sec-head">
            <div><span className="eyebrow teal">The team</span><h2 className="disp">Rest of the <span className="o-teal">crew</span></h2></div>
            <Cta href="/drift#drivers">All drivers</Cta>
          </div>
          {others.map((d, i) => <DriverBlock key={d.id} driver={d} flip={i % 2 === 0} />)}
        </section>
      )}
    </>
  );
}
