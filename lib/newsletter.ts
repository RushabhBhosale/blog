import Subscriber from "@/models/subscriber";
import { sendMail } from "@/lib/mailer";
import crypto from "crypto";

export async function subscribeEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const token = cryptoRandomToken();

  // Upsert by email to make idempotent
  const existing = await Subscriber.findOne({ email: normalized });
  if (existing) return existing;
  const sub = await Subscriber.create({ email: normalized, token });
  return sub;
}

export async function unsubscribeByToken(token: string) {
  const res = await Subscriber.findOneAndDelete({ token });
  return Boolean(res);
}

export async function notifySubscribersOfNewBlog(blog: {
  title: string;
  slug: string;
  image?: string;
  category?: string;
  author?: string;
  createdAt?: string | Date;
}) {
  const subscribers: { email: string; token: string }[] = await Subscriber.find().select(
    "email token"
  );
  if (!subscribers?.length) return { sent: 0 };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "";
  const fullBase = baseUrl?.startsWith("http") ? baseUrl : baseUrl ? `https://${baseUrl}` : "";
  const blogUrl = `${fullBase}/blog/${blog.slug}`;

  const results = await Promise.allSettled(
    subscribers.map((s) =>
      sendMail({
        to: s.email,
        subject: `New post: ${blog.title}`,
        html: renderNewBlogHtml({ blog, blogUrl, token: s.token, baseUrl: fullBase }),
        text: `A new blog post is live: ${blog.title}\n${blogUrl}\n\nUnsubscribe: ${fullBase}/api/newsletter/unsubscribe/${s.token}`,
      })
    )
  );
  const sent = results.filter((r) => r.status === "fulfilled").length;
  return { sent, total: subscribers.length };
}

function cryptoRandomToken() {
  return crypto.randomBytes(16).toString("hex");
}

function renderNewBlogHtml({
  blog,
  blogUrl,
  token,
  baseUrl,
}: {
  blog: { title: string; category?: string; author?: string; image?: string };
  blogUrl: string;
  token: string;
  baseUrl: string;
}) {
  const unsubscribe = `${baseUrl}/api/newsletter/unsubscribe/${token}`;
  return `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.6; color:#0f172a">
    <h2 style="margin:0 0 12px">New post is live: ${escapeHtml(blog.title)}</h2>
    <p style="margin:0 0 16px">${blog.category ? `<strong>${escapeHtml(blog.category)}</strong> · ` : ""}${blog.author ? `${escapeHtml(blog.author)}` : ""}</p>
    ${blog.image ? `<img src="${blog.image}" alt="${escapeHtml(blog.title)}" style="max-width:100%; border-radius:8px; margin: 8px 0 16px"/>` : ""}
    <p><a href="${blogUrl}" style="display:inline-block; background:#111827; color:#fff; padding:10px 16px; border-radius:8px; text-decoration:none">Read post</a></p>
    <hr style="border:0;border-top:1px solid #e5e7eb; margin:20px 0"/>
    <p style="color:#6b7280; font-size:12px">You’re receiving this because you subscribed to updates. <a href="${unsubscribe}">Unsubscribe</a></p>
  </div>`;
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return ch;
    }
  });
}
