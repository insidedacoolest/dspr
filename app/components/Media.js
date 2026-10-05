import Icon from "./Icon";

// Uploaded photo, or a striped placeholder with an outlined label so layouts
// never look empty before real photos are uploaded.
export default function Media({ src, alt = "", label, icon, className = "", ratio, light = false }) {
  const style = ratio ? { aspectRatio: ratio } : undefined;
  if (src) {
    return (
      <div className={`media ${className}`.trim()} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" />
      </div>
    );
  }
  return (
    <div className={`media media-ph${light ? " light" : ""} ${className}`.trim()} style={style} role="img" aria-label={alt || label || ""}>
      {icon ? <Icon name={icon} size={72} strokeWidth={1.2} /> : label && <span className="ph-label" aria-hidden="true">{label}</span>}
    </div>
  );
}
