import Subscriber from "@/models/subscriber";
import { sendMail } from "@/lib/mailer";
import crypto from "crypto";

export async function subscribeEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const token = cryptoRandomToken();
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
  const subscribers: { email: string; token: string }[] =
    await Subscriber.find().select("email token");
  if (!subscribers?.length) return { sent: 0 };

  const rawBase =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    "";
  const fullBase = rawBase?.startsWith("http")
    ? rawBase
    : rawBase
    ? `https://${rawBase}`
    : "";
  const blogUrl = `${fullBase}/blog/${blog.slug}`;

  const subject = `${blog.title}`;
  const results = await Promise.allSettled(
    subscribers.map((s) => {
      const html = renderNewBlogHtml({
        blog,
        blogUrl: withUtm(blogUrl, {
          utm_source: "newsletter",
          utm_medium: "email",
          utm_campaign: "new_post",
        }),
        token: s.token,
        baseUrl: fullBase,
      });
      const text = `New post on Daily Sparks: ${blog.title}\n${blogUrl}\n\nUnsubscribe: ${fullBase}/api/newsletter/unsubscribe/${s.token}`;
      const listUnsub = `<${fullBase}/api/newsletter/unsubscribe/${s.token}>`;
      return sendMail({
        to: s.email,
        subject,
        html,
        text,
        headers: {
          "List-Unsubscribe": listUnsub,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return { sent, total: subscribers.length };
}

function cryptoRandomToken() {
  return crypto.randomBytes(16).toString("hex");
}

function withUtm(url: string, params: Record<string, string>) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
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
  const title = escapeHtml(blog.title);
  const author = blog.author ? escapeHtml(blog.author) : "";
  const category = blog.category ? escapeHtml(blog.category) : "";
  const img = blog.image ? blog.image : "";
  const unsub = `${baseUrl}/api/newsletter/unsubscribe/${token}`;
  const preview = `New on Daily Sparks: ${title}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    .hover-underline:hover { text-decoration: underline !important; }
    @media (max-width:640px){ .container{ width:100% !important; } .px{ padding-left:16px !important; padding-right:16px !important; } .h1{ font-size:22px !important; line-height:28px !important; } .meta{ font-size:12px !important; } .btn{ padding:12px 18px !important; } }
  </style>
</head>
<body style="margin:0;background:#0b1220;">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
    ${preview}
  </span>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="640" style="width:640px;background:#0f172a;border-radius:16px;overflow:hidden;color:#e5e7eb;">
          <tr>
            <td class="px" style="padding:24px 24px 0 24px;">
              <a href="${escapeAttr(
                baseUrl
              )}" style="text-decoration:none;color:#e5e7eb;font-weight:700;font-size:16px;">Daily Sparks</a>
            </td>
          </tr>

          ${
            img
              ? `
          <tr>
            <td style="padding:16px 0 0 0;">
              <img src="${escapeAttr(
                img
              )}" alt="${title}" width="640" style="display:block;width:100%;height:auto;max-width:100%;">
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td class="px" style="padding:20px 24px 8px 24px;">
              <h1 class="h1" style="margin:0 0 8px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;font-size:24px;line-height:32px;color:#ffffff;">${title}</h1>
              <p class="meta" style="margin:0 0 16px 0;font-size:13px;line-height:18px;color:#94a3b8;">
                ${
                  category
                    ? `<strong style="color:#e2e8f0">${category}</strong> · `
                    : ""
                }${author ? `${author}` : ""}
              </p>

              <!-- Button (bulletproof, Outlook-safe) -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">
                <tr>
                  <td align="left" bgcolor="#111827" style="border-radius:10px;">
                    <a href="${escapeAttr(blogUrl)}"
                       style="display:inline-block;padding:14px 20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;font-size:14px;line-height:1;color:#ffffff;text-decoration:none;background:#111827;border-radius:10px;"
                       class="btn">Read post</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;font-size:13px;color:#9aa4b2;">
                Or paste this link into your browser:<br>
                <span style="word-break:break-all;color:#cbd5e1;">${escapeHtml(
                  blogUrl
                )}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 24px 24px;">
              <hr style="border:0;border-top:1px solid #1f2937;margin:0 0 16px 0;">
              <p class="meta" style="margin:0 0 6px 0;font-size:12px;color:#94a3b8;">
                You’re receiving this because you subscribed to Daily Sparks updates.
              </p>
              <p class="meta" style="margin:0 0 16px 0;font-size:12px;color:#94a3b8;">
                <a href="${escapeAttr(
                  unsub
                )}" style="color:#cbd5e1;text-decoration:none;" class="hover-underline">Unsubscribe</a>
              </p>
              <p class="meta" style="margin:0 0 0 0;font-size:11px;color:#64748b;">
                © ${new Date().getFullYear()} Daily Sparks. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="width:640px;margin-top:12px;">
          <tr>
            <td style="text-align:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif;font-size:11px;color:#94a3b8;">
              Trouble viewing? <a href="${escapeAttr(
                blogUrl
              )}" style="color:#cbd5e1;text-decoration:none;" class="hover-underline">Open in browser</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
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

function escapeAttr(str: string) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
