import Link from "next/link";

// Chevron block button: « » tab + slanted label.
// tone: "" (teal) | pink | dark | white | yellow
export default function Cta({ href, children, tone = "", size = "", external = false, className = "" }) {
  const cls = `cta ${tone} ${size} ${className}`.replace(/\s+/g, " ").trim();
  const inner = (
    <>
      <i aria-hidden="true">»</i>
      <span>{children}</span>
    </>
  );
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{inner}</a>;
  }
  return <Link href={href} className={cls}>{inner}</Link>;
}
