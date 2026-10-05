import Link from "next/link";
import Media from "./Media";
import Icon, { productGlyph } from "./Icon";
import { usd } from "../lib/format";
import { categoryLabel } from "../lib/constants";

export default function ProductCard({ product }) {
  const onSale = product.oldPrice && product.oldPrice > product.price;
  const img = product.images?.[0];
  return (
    <Link href={`/shop/${product.id}`} className={`prod${product.inStock ? "" : " sold-out"}`}>
      <div className={`pic${img ? " has-img" : ""}`}>
        {img ? <Media src={img} alt={product.name} /> : <span className="glyph"><Icon name={productGlyph(product)} size={120} strokeWidth={1.1} /></span>}
        <div className="flags">
          {product.featured && <span className="badge badge-pink">New</span>}
          {onSale && <span className="badge badge-yellow">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
          {!product.inStock && <span className="badge">Sold out</span>}
        </div>
      </div>
      <span className="cat">{product.brand ? `${product.brand} · ` : ""}{categoryLabel(product.section, product.category)}</span>
      <h3>{product.name}</h3>
      <span className="price">{onSale && <s>{usd(product.oldPrice)}</s>}{usd(product.price)}</span>
    </Link>
  );
}
