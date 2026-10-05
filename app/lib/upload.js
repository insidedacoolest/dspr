import "server-only";
import { mkdir, writeFile, chmod } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

function extFromType(type) {
  switch (type) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    case "image/svg+xml": return "svg";
    default: return "bin";
  }
}

/**
 * Saves an uploaded File (from a Server Action's FormData) under
 * public/uploads/<folder>/ and returns its public URL, or null if no
 * (valid) file was provided.
 */
export async function saveUploadedImage(file, folder) {
  if (!file || typeof file !== "object" || !("arrayBuffer" in file)) return null;
  if (file.size === 0) return null;
  if (file.size > MAX_SIZE) throw new Error("Image too large (max 20MB).");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Unsupported image format.");

  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  // The host's umask can strip the traverse (x) bit for group/other on newly
  // created directories, which leaves files inside unreachable to whatever
  // process serves static assets even though the files themselves are
  // readable — chmod explicitly here since it isn't subject to umask.
  await chmod(dir, 0o755).catch(() => {});

  const filename = `${crypto.randomUUID()}.${extFromType(file.type)}`;
  const filePath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  await chmod(filePath, 0o644).catch(() => {});

  return `/uploads/${folder}/${filename}`;
}
