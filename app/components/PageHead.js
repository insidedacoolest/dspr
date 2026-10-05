import Link from "next/link";
import Media from "./Media";

// Dark full-bleed header for inner pages; the site header floats over it.
export default function PageHead({ crumb, eyebrow, title, outline, lede, image, ghost, children }) {
  return (
    <section className="page-head">
      {image && <Media src={image} alt="" className="fill" />}
      <div className="slash" aria-hidden="true" />
      {ghost && <span className="ghost" aria-hidden="true">{ghost}</span>}
      <div className="wrap">
        <div className="breadcrumb"><Link href="/">Home</Link> / {crumb}</div>
        {eyebrow && <div style={{ marginTop: 18 }}><span className="eyebrow teal">{eyebrow}</span></div>}
        <h1 className="disp">{title}{outline && <> <span className="o-white">{outline}</span></>}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
