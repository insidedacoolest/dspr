import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// NOTE: events, products, news and milestones below are SAMPLE DATA —
// replace them with the real ones in the admin panel.
// Placeholder photos are thumbnails from the team's own YouTube channel.
const yt = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

const SETTINGS = {
  heroImage: yt("9y2j8lMHlW8"),
  eventImage: yt("NAqZHbV5AAU"),
  homeGarageImage: yt("qbbV-xLdBXs"),
  garageImage: yt("qbbV-xLdBXs"),
  aboutImage: yt("ZX_dnrW4_-A"),
};

const DRIVERS = [
  {
    slug: "brandon-wicknick", num: "801", name: "Brandon Wicknick", role: "Owner · Pro driver", car: "Lexus IS300", engine: "Toyota 2JZ turbo", power: 0,
    specs: "2JZ swap\nCD009 gearbox (Pro Car 2.0)\nWisefab angle kit\nDual Volvo power steering pumps",
    bio: "Professional drifter and owner of D-Spare Garage. Former Formula D competitor and Drift Week regular. Addicted to drifting and anything JZ powered.",
    instagram: "https://www.instagram.com/bwicknick/", order: 1,
    imageUrl: yt("MVNSCKV4lzE"), carImageUrl: yt("aulBXxgQMKs"),
  },
];

const d = (s) => new Date(s);
const EVENTS = [
  { title: "Hot Pit Auto Fest — Round 4 (sample)", location: "Utah Motorsports Campus", date: d("2026-10-17T09:00:00"), kind: "comp", desc: "Sample event — edit or delete in the admin panel." },
  { title: "Winter practice day (sample)", location: "Utah (TBA)", date: d("2026-11-21T09:00:00"), kind: "practice", desc: "Open practice for shop customers." },
  { title: "Hot Pit Auto Fest — Round 3", location: "Utah", date: d("2026-09-06T09:00:00"), kind: "comp", desc: "Sample past event." },
  { title: "Hot Pit Auto Fest — Round 2", location: "Utah", date: d("2026-07-18T09:00:00"), kind: "comp", desc: "Sample past event." },
];

const SERVICES = [
  { name: "Drift alignment & setup", description: "Alignment, corner balancing and suspension setup for drift — the same process we run on our own cars.", priceFrom: 180, duration: "1 day", icon: "steering", featured: true },
  { name: "Angle kits & steering", description: "Install and dial in angle kits, knuckles, arms and steering racks for more lock and control.", priceFrom: 350, duration: "1–2 days", icon: "coilover" },
  { name: "Chassis & suspension", description: "Coilovers, arms, bushings, subframe work and seam welding. Our bread and butter.", priceFrom: null, duration: "quote", icon: "cage" },
  { name: "Engine swaps", description: "JZ swaps (our weakness), turbo kits, wiring and cooling done right for track reliability.", priceFrom: null, duration: "quote", icon: "engine" },
  { name: "Tuning & diagnostics", description: "ECU Master tuning, data logging and troubleshooting.", priceFrom: 120, duration: "2–4 hrs", icon: "laptop" },
  { name: "Fabrication & welding", description: "Cages, mounts, exhausts and one-off parts.", priceFrom: null, duration: "quote", icon: "weld" },
];

const PRODUCTS = [
  { name: "DSPR Team Tee — Black", section: "merch", category: "apparel", price: 30, sizesCsv: "S,M,L,XL,2XL", description: "Heavyweight cotton tee with the DSPR sparkle on the back.", featured: true },
  { name: "801 Hoodie — Teal", section: "merch", category: "apparel", price: 65, oldPrice: 75, sizesCsv: "S,M,L,XL,2XL", description: "Fleece-lined hoodie with the 801 print.", featured: true },
  { name: "DSPR Snapback", section: "merch", category: "hats", price: 32, description: "Embroidered snapback.", featured: true },
  { name: "Sticker pack (x6)", section: "merch", category: "stickers", price: 10, description: "Six vinyl stickers for the car, the toolbox or the laptop.", featured: false },
  { name: "Windshield banner", section: "merch", category: "stickers", price: 20, variantsJson: JSON.stringify([{ label: "White", price: 20 }, { label: "Teal", price: 20 }, { label: "Holographic", price: 28 }]), description: "Cut-vinyl windshield banner.", featured: true },
  { name: "Adjustable coilovers", section: "parts", category: "suspension", brand: "Sample", sku: "CO-IS300", fitment: "Lexus IS300 (XE10)", price: 1150, description: "Height and damping adjustable coilovers.", featured: false },
  { name: "Angle kit", section: "parts", category: "steering", brand: "Sample", sku: "AK-IS300", fitment: "Lexus IS300 / Toyota Altezza", price: 1890, description: "Full angle kit with reinforced arms.", featured: false },
  { name: "Hydraulic handbrake", section: "parts", category: "brakes", brand: "Sample", sku: "HB-UNI", fitment: "Universal", price: 165, description: "Vertical hydraulic handbrake lever.", featured: false },
];

const NEWS = [
  { title: "Hot Pit Auto Fest Round 3 is up", excerpt: "Part 1 of the round 3 vlog is live on the channel — and yes, a turbo broke in half.", body: "Sample text — write the full post in the admin panel.", section: "drift", publishedAt: d("2026-09-13"), imageUrl: yt("NAqZHbV5AAU") },
  { title: "Back to stock pistons?", excerpt: "From high-compression turbo back to stock pistons. Can we make the same power?", body: "Sample text — write the full post in the admin panel.", section: "garage", publishedAt: d("2026-09-06"), imageUrl: yt("qbbV-xLdBXs") },
  { title: "New merch drop", excerpt: "Teal 801 hoodies and windshield banners are in the shop.", body: "Sample text — write the full post in the admin panel.", section: "shop", publishedAt: d("2026-08-30"), imageUrl: yt("nTpNDpEF8-0") },
];

const MILESTONES = [
  { year: "2012", title: "The channel goes live", text: "Builds, breakdowns and shop shenanigans start hitting YouTube." },
  { year: "Formula D", title: "Pro debut", text: "Sample milestone — add the real year and story in the admin panel." },
  { year: "Drift Week", title: "Ten Drift Weeks and counting", text: "Sample milestone — edit in the admin panel." },
  { year: "2026", title: "Pro Car 2.0", text: "A new 2JZ / CD009 IS300 build for the Hot Pit Auto Fest season." },
];

const PARTNERS = [{ name: "Partner 01" }, { name: "Partner 02" }, { name: "Partner 03" }, { name: "Partner 04" }];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@dsparegarage.com").toLowerCase();
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "change-me-now", 10);
  await prisma.adminUser.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  for (const m of ["driver", "event", "service", "product", "newsPost", "partner", "galleryImage", "milestone"]) await prisma[m].deleteMany();

  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  for (const x of DRIVERS) await prisma.driver.create({ data: x });
  for (const x of EVENTS) await prisma.event.create({ data: x });
  for (const [i, x] of SERVICES.entries()) await prisma.service.create({ data: { ...x, order: i } });
  for (const x of PRODUCTS) await prisma.product.create({ data: x });
  for (const x of NEWS) await prisma.newsPost.create({ data: x });
  for (const [i, x] of MILESTONES.entries()) await prisma.milestone.create({ data: { ...x, order: i } });
  for (const [i, x] of PARTNERS.entries()) await prisma.partner.create({ data: { ...x, order: i } });

  console.log("Seed done. Admin:", email);
}

main().finally(() => prisma.$disconnect());
