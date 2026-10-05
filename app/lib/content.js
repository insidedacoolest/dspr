// Every editable text / image on the public site lives here as a key in the
// Setting table. This schema drives both the defaults (used until the admin
// changes something) and the "Site content" editor in the admin panel, so
// adding a field here makes it editable automatically.
//
// Field types: text | textarea | url | image | lines
//   lines = one item per line, "Title | Text" pairs where noted.

export const CONTENT_GROUPS = [
  {
    id: "brand",
    label: "Brand & logo",
    hint: "Until a logo is uploaded, the site shows the name as a text wordmark.",
    fields: [
      { key: "brandName", label: "Short name (wordmark)", type: "text", default: "DSPR" },
      { key: "brandSub", label: "Small line under the wordmark", type: "text", default: "Drift team" },
      { key: "brandFull", label: "Full business name", type: "text", default: "D-Spare Garage" },
      { key: "logo", label: "Logo for light backgrounds", type: "image", hint: "PNG or SVG with transparent background, dark logo." },
      { key: "logoDark", label: "Logo for dark backgrounds", type: "image", hint: "Light/white version. Used in the footer and admin panel." },
    ],
  },
  {
    id: "contact",
    label: "Contact & social",
    hint: "Used in the header, footer, garage page and checkout.",
    fields: [
      { key: "phone", label: "Phone", type: "text", default: "+1 801-637-4570" },
      { key: "email", label: "Email", type: "text", default: "dsparegarage.com@gmail.com" },
      { key: "notifyEmail", label: "Email that receives new order notifications", type: "text", default: "dsparegarage.com@gmail.com", hint: "Separate several addresses with commas." },
      { key: "address", label: "Street address", type: "text", default: "638 S Main St" },
      { key: "city", label: "City / state", type: "text", default: "Clearfield, Utah" },
      { key: "hours", label: "Opening hours", type: "text", default: "Mon–Fri 9am–6pm · Sat by appointment" },
      { key: "mapUrl", label: "Google Maps link", type: "url", default: "https://maps.google.com/?q=638+S+Main+St+Clearfield+UT" },
      { key: "instagram", label: "Instagram — shop", type: "url", default: "https://www.instagram.com/dsparegarage/" },
      { key: "instagramDriver", label: "Instagram — Brandon", type: "url", default: "https://www.instagram.com/bwicknick/" },
      { key: "facebook", label: "Facebook — shop", type: "url", default: "https://www.facebook.com/dsparegarage" },
      { key: "youtube", label: "YouTube", type: "url", default: "https://www.youtube.com/@BrandonWicknick" },
      { key: "instaHandle", label: "Instagram handle shown on the site", type: "text", default: "@dsparegarage" },
    ],
  },
  {
    id: "home",
    label: "Home page",
    fields: [
      { key: "topbarText", label: "Top announcement bar", type: "text", default: "", hint: "Leave empty to show the next event automatically. Type “off” to hide the bar." },
      { key: "heroKicker", label: "Small line above the title", type: "text", default: "Clearfield, Utah · Pro drift team & race shop" },
      { key: "heroLine1", label: "Title — line 1 (solid)", type: "text", default: "Send it" },
      { key: "heroLine2", label: "Title — line 2 (outlined)", type: "text", default: "from the" },
      { key: "heroBig", label: "Title — highlight (teal)", type: "text", default: "801" },
      { key: "heroTagline", label: "Intro paragraph", type: "textarea", default: "D-Spare Garage builds chassis, suspension and complete drift cars — then proves them on track, every single season." },
      { key: "heroImage", label: "Hero photo", type: "image", hint: "Wide action shot, min. 2000px wide." },
      { key: "heroCta1", label: "Hero button 1", type: "text", default: "Join the DSPR crew" },
      { key: "heroCta2", label: "Hero button 2", type: "text", default: "Book the shop" },
      { key: "stat1Value", label: "Stat 1 — value", type: "text", default: "16.8K" },
      { key: "stat1Label", label: "Stat 1 — label", type: "text", default: "Followers" },
      { key: "stat2Value", label: "Stat 2 — value", type: "text", default: "320+" },
      { key: "stat2Label", label: "Stat 2 — label", type: "text", default: "Episodes" },
      { key: "stat3Value", label: "Stat 3 — value", type: "text", default: "2JZ" },
      { key: "stat3Label", label: "Stat 3 — label", type: "text", default: "Powered" },
      { key: "eventImage", label: "Next event card — photo", type: "image" },
      { key: "teamTitle1", label: "Team section — title (solid)", type: "text", default: "Meet the" },
      { key: "teamTitle2", label: "Team section — title (outlined)", type: "text", default: "crew" },
      { key: "teamText", label: "Team section — text", type: "textarea", default: "Drivers who build their own cars. Every setup we sell is proven under our own roll cage first." },
      { key: "shopTitle1", label: "Shop section — title", type: "text", default: "Featured" },
      { key: "shopTitle2", label: "Shop section — title (outlined)", type: "text", default: "products" },
      { key: "garageTitle1", label: "Garage section — title line 1", type: "text", default: "Race shop." },
      { key: "garageTitle2", label: "Garage section — title line 2 (pink)", type: "text", default: "Your car." },
      { key: "homeGarageImage", label: "Garage section — photo", type: "image" },
      { key: "newsTitle", label: "News section — title", type: "text", default: "News & episodes" },
      { key: "joinTitle1", label: "Join band — line 1", type: "text", default: "Join the" },
      { key: "joinTitle2", label: "Join band — outlined word", type: "text", default: "DSPR" },
      { key: "joinTitle3", label: "Join band — last word", type: "text", default: "crew" },
      { key: "joinText", label: "Join band — text", type: "textarea", default: "Follow the team, ride along at events and come hang out at the shop. Utah drift culture is all about the people." },
      { key: "videoId", label: "Featured YouTube video (ID or link)", type: "text", default: "NAqZHbV5AAU", hint: "Shown on the Drift page. Paste the video link or the ID. Leave empty to hide." },
      { key: "videoTitle", label: "Video — title", type: "text", default: "Latest episode" },
      { key: "videoText", label: "Video — text", type: "textarea", default: "Builds, breakdowns, drift events and shop shenanigans — every week on the channel." },
    ],
  },
  {
    id: "about",
    label: "About page",
    fields: [
      { key: "aboutTitle", label: "Page title", type: "text", default: "About the shop" },
      { key: "aboutLede", label: "Intro", type: "textarea", default: "A speed shop in Clearfield run by people who drift every weekend they can. Utah drift culture is all about the people — so is this garage." },
      { key: "aboutImage", label: "Main photo", type: "image" },
      { key: "aboutStoryTitle", label: "Story — title", type: "text", default: "Grassroots to pro, same garage" },
      { key: "aboutStory", label: "Story — text (blank line = new paragraph)", type: "textarea", default: "D-Spare Garage started the way most drift shops do: too many cars, not enough weekends, and friends who needed help with theirs.\n\nToday we build cool cars for customers and for ourselves. Chassis and suspension are our bread and butter, JZ swaps are our weakness, and every setup we sell has been proven on our own cars first.\n\nCome hang out, bring your car, and let’s get it sideways." },
      { key: "founderName", label: "Founder — name", type: "text", default: "Brandon Wicknick" },
      { key: "founderRole", label: "Founder — role", type: "text", default: "Owner · Pro drifter" },
      { key: "founderBio", label: "Founder — bio", type: "textarea", default: "Professional drifter and owner of D-Spare Garage. Former Formula D competitor, Drift Week regular and the guy behind the camera on the YouTube channel. Addicted to drifting and anything JZ powered." },
      { key: "founderImage", label: "Founder — photo", type: "image" },
      { key: "aboutQuote", label: "Quote", type: "textarea", default: "One thing I love about drifting is the people you meet." },
      { key: "valuesTitle", label: "Values — title", type: "text", default: "How we roll" },
      { key: "values", label: "Values (one per line: Title | Text)", type: "lines", default: "Track-proven | If it’s on your car, it’s been on ours first.\nStraight talk | Clear quotes, honest timelines, no surprise invoices.\nCommunity first | Local drivers, ride-alongs, shop hangouts. Everyone’s welcome.\nBuilt to be driven | Cars that survive a full event weekend, not just a photo shoot." },
      { key: "timelineTitle", label: "Timeline — title", type: "text", default: "Mileage so far" },
    ],
  },
  {
    id: "drift",
    label: "Drift page",
    fields: [
      { key: "driftLede", label: "Intro", type: "textarea", default: "The drivers, the cars, the events. Everything that happens when the rear tires stop agreeing with the fronts." },
      { key: "driftManifesto", label: "Big statement", type: "textarea", default: "It’s not just smoke. It’s angle, line and friends sharing the same track." },
      { key: "driftSide", label: "Statement — side text", type: "textarea", default: "From local grassroots rounds to pro events and cross-country Drift Week trips, the D-Spare cars are out there getting used — and fixed — every season." },
      { key: "sponsorTitle", label: "Sponsorship — title", type: "text", default: "Your logo, sideways." },
      { key: "sponsorText", label: "Sponsorship — text", type: "textarea", default: "Space on the cars, presence at events and weekly content on YouTube and Instagram. Let’s talk." },
    ],
  },
  {
    id: "garage",
    label: "Garage page",
    fields: [
      { key: "garageLede", label: "Intro", type: "textarea", default: "Chassis, suspension, swaps and full drift builds by people who compete. Street car, grassroots missile or pro car — treated like it’s ours." },
      { key: "garageImage", label: "Header photo", type: "image" },
      { key: "processSteps", label: "Process steps (one per line: Title | Text)", type: "lines", default: "Talk | Tell us what you want the car to do. We look at what it actually is.\nQuote | A clear plan with parts, labor and timeline. No surprises.\nBuild | Hands that prep competition cars every week.\nShakedown | We test before handover. Sideways, when possible." },
      { key: "bookingTitle", label: "Booking — title", type: "text", default: "Book your car in" },
      { key: "bookingText", label: "Booking — text", type: "textarea", default: "Tell us about the car and what you need. We’ll get back to you with availability and a quote." },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    fields: [
      { key: "shopLede", label: "Intro", type: "textarea", default: "Rep the team or upgrade the car with the parts we run on track. Order online, pick up at the shop or get it shipped." },
      { key: "checkoutNote", label: "Payment note (cart & checkout)", type: "textarea", default: "Secure checkout with PayPal or credit / debit card. You’ll get an email confirmation as soon as your order is paid." },
      { key: "shippingFlat", label: "Shipping — flat rate (USD)", type: "text", default: "9.95", hint: "Charged on every shipped order. Use 0 for free shipping." },
      { key: "freeShippingOver", label: "Shipping — free above (USD)", type: "text", default: "100", hint: "Orders at or above this subtotal ship free. Leave empty to disable." },
      { key: "shippingNote", label: "Shipping note (checkout)", type: "text", default: "Ships within the US in 2–5 business days." },
    ],
  },
  {
    id: "footer",
    label: "Footer & SEO",
    fields: [
      { key: "footerBlurb", label: "Footer text", type: "textarea", default: "Utah drift shop & race team. We build cool cars — come hang out." },
      { key: "siteTitle", label: "Browser title", type: "text", default: "D-Spare Garage — Utah drift shop & race team" },
      { key: "siteDescription", label: "Search engine description", type: "textarea", default: "D-Spare Garage (DSPR) is a drift shop in Clearfield, Utah: chassis, suspension, swaps and full builds, a pro drift team, merch and parts." },
    ],
  },
];

export const CONTENT_FIELDS = CONTENT_GROUPS.flatMap((g) => g.fields);
export const IMAGE_KEYS = CONTENT_FIELDS.filter((f) => f.type === "image").map((f) => f.key);
export const SETTING_DEFAULTS = Object.fromEntries(CONTENT_FIELDS.map((f) => [f.key, f.default ?? ""]));

// "Title | Text" lines → [{ title, text }]
export function parsePairs(value) {
  return String(value || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split("|");
      return { title: title.trim(), text: rest.join("|").trim() };
    });
}

export function paragraphs(value) {
  return String(value || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Accepts a full YouTube link or a bare ID.
export function youtubeId(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  const m = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : "";
}
