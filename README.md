This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Newsletter (SMTP)

To enable newsletter subscriptions and email notifications for new blog posts, configure SMTP environment variables in `.env`:

- `SMTP_HOST` — SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT` — SMTP port (465 for SSL, 587 for TLS)
- `SMTP_USER` — SMTP username/login
- `SMTP_PASS` — SMTP password or app password
- `SMTP_FROM` — From email address (defaults to `SMTP_USER`)
- `NEXT_PUBLIC_BASE_URL` — Public base URL used in links (e.g., https://dailysparks.rushabh.in)

How it works:
- Users can subscribe on the Home page; emails are stored in MongoDB.
- On blog creation, the server emails all subscribers with a link to the new post and an unsubscribe link.
- Users can unsubscribe via a one-click tokenized link included in every email.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
