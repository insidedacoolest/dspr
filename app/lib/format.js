const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function usd(value) {
  return USD.format(Number(value || 0));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(date) {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function dateParts(date) {
  const d = new Date(date);
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

export function toDateInput(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
