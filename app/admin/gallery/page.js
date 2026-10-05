import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { uploadImages, updateImage, deleteImage } from "./actions";
import { ConfirmButton } from "../ui";

export const metadata = { title: "Gallery — Admin" };

export default async function GaleriaPage() {
  await requireAdmin();
  const images = await prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { id: "desc" }] });
  return (
    <>
      <div className="admin-head"><div><h1>Gallery</h1><p>Photos for the Gallery section on the Drift page.</p></div></div>

      <form action={uploadImages} className="admin-form" style={{ marginBottom: "2.5rem" }}>
        <fieldset>
          <legend>Upload photos</legend>
          <input type="file" name="images" accept="image/*" multiple required />
          <label className="field"><span>Caption (optional, applies to all)</span><input name="caption" placeholder="e.g. Hot Pit Auto Fest 2026" /></label>
          <div className="form-actions"><button className="btn btn-pink btn-sm"><span>Upload</span></button></div>
        </fieldset>
      </form>

      <div className="gallery-admin">
        {images.map((g) => (
          <figure key={g.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.imageUrl} alt={g.caption} />
            <figcaption>
              <form action={updateImage.bind(null, g.id)} className="form" style={{ gap: ".4rem" }}>
                <input name="caption" defaultValue={g.caption} placeholder="Caption" className="field" style={{ background: "var(--bg)", border: "1px solid var(--line-2)", padding: ".4rem .5rem" }} />
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <input name="order" type="number" defaultValue={g.order} title="Order" style={{ width: 60, background: "var(--bg)", border: "1px solid var(--line-2)", padding: ".4rem .5rem" }} />
                  <button className="link-btn">Save</button>
                </div>
              </form>
              <form action={deleteImage.bind(null, g.id)}><ConfirmButton className="link-btn danger-btn" message="Delete this photo?">Delete</ConfirmButton></form>
            </figcaption>
          </figure>
        ))}
        {images.length === 0 && <p className="hint">No photos yet — the gallery shows placeholders until you upload some.</p>}
      </div>
    </>
  );
}
