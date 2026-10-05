// Shows the uploaded logo (Admin → Site content → Brand & logo) or, until
// one exists, a text wordmark built from the brand name.
export default function Logo({ brand, dark = true, size = "md" }) {
  const src = dark ? brand?.logoDark || brand?.logo : brand?.logo || brand?.logoDark;
  const name = brand?.brandFull || "D-Spare Garage";
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={`logo-img ${size}`} />;
  }
  return (
    <span className={`logo ${size}`} aria-label={name}>
      <span aria-hidden="true">{brand?.brandName || "DSPR"}</span>
      {brand?.brandSub && <small aria-hidden="true">{brand.brandSub}</small>}
    </span>
  );
}

export function brandProps(s) {
  return { brandName: s.brandName, brandSub: s.brandSub, brandFull: s.brandFull, logo: s.logo, logoDark: s.logoDark };
}
