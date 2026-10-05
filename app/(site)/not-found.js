import Cta from "../components/Cta";

export default function NotFound() {
  return (
    <section className="not-found">
      <div>
        <span className="eyebrow teal">Error 404</span>
        <h1 className="disp">Spun <span className="o-white">out</span></h1>
        <p className="lede light" style={{ margin: "10px auto 34px" }}>You left the track. This page doesn’t exist — or it’s already in the scrap pile.</p>
        <Cta href="/">Back on track</Cta>
      </div>
    </section>
  );
}
