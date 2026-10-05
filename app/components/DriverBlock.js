import Media from "./Media";
import Cta from "./Cta";

// RTR-style driver feature: big photo with cut edge, giant number,
// name split in two lines and a quick spec strip.
export default function DriverBlock({ driver, flip = false, cta = true }) {
  const [first, ...rest] = driver.name.split(" ");
  return (
    <div className={`driver${flip ? " flip" : ""}`}>
      <div className="driver-photo">
        <Media src={driver.imageUrl} alt={driver.name} label={driver.name} className="fill" />
      </div>
      <span className="driver-num" aria-hidden="true">{driver.num}</span>
      <div className="driver-info">
        <span className="eyebrow">{driver.role}{driver.nickname ? ` · “${driver.nickname}”` : ""}</span>
        <h3 className="disp">{first} <span>{rest.join(" ")}</span></h3>
        {driver.bio && <p>{driver.bio}</p>}
        <div className="spec-mini">
          <div><small>Car</small><b>{driver.car}</b></div>
          {driver.engine && <div><small>Engine</small><b>{driver.engine}</b></div>}
          {driver.power > 0 ? <div><small>Power</small><b>{driver.power} hp</b></div> : <div><small>Number</small><b>#{driver.num}</b></div>}
        </div>
        {cta && <Cta href={`/drift/${driver.slug}`}>Driver bio</Cta>}
      </div>
    </div>
  );
}
