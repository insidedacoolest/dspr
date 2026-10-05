import "server-only";
import nodemailer from "nodemailer";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Sends email through SMTP when configured; otherwise (local development)
// writes each message to ./mail-outbox/*.html so it can be previewed.
// Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (true/false), MAIL_FROM

let transporter;

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text, replyTo }) {
  const recipients = String(to || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (recipients.length === 0) return { skipped: true };

  if (!mailConfigured()) {
    const dir = path.join(process.cwd(), "mail-outbox");
    await mkdir(dir, { recursive: true });
    const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
    const file = path.join(dir, `${Date.now()}-${slug}.html`);
    await writeFile(file, `<!-- To: ${recipients.join(", ")} | Subject: ${subject} -->\n${html}`);
    console.log(`[mail] SMTP not configured — saved "${subject}" for ${recipients.join(", ")} to ${file}`);
    return { saved: file };
  }

  return getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: recipients.join(", "),
    replyTo,
    subject,
    html,
    text,
  });
}
