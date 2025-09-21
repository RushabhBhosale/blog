import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || process.env.FROM_EMAIL || user || "";

if (!host || !user || !pass) {
  // We intentionally do not throw here to avoid crashing on import in builds
  // The API routes should handle missing configuration gracefully.
  // console.warn("SMTP not fully configured; emails will be skipped.");
}

export function getTransporter() {
  if (!host || !user || !pass) return null as any;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
  return transporter;
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  const info = await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  return info;
}
