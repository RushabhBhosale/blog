// app/contact/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Daily Sparks",
  description:
    "Get in touch with Rushabh Bhosale, creator of Daily Sparks. For feedback, collaborations, or inquiries, reach out directly here.",
  alternates: { canonical: "https://dailysparks.in/contact" },
  openGraph: {
    type: "website",
    url: "https://dailysparks.in/contact",
    title: "Contact — Daily Sparks",
    description:
      "Connect with Rushabh Bhosale for feedback, collaborations, or business inquiries.",
    siteName: "Daily Sparks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Daily Sparks",
    description:
      "Connect with Rushabh Bhosale for feedback, collaborations, or business inquiries.",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-lg leading-7 text-muted-foreground">
        Thanks for checking out{" "}
        <span className="font-medium">Daily Sparks</span>! I’d love to hear from
        you. Whether it’s feedback, a collaboration idea, or just to say hello —
        feel free to reach out.
      </p>

      <section className="mt-8 rounded-2xl border bg-background p-6">
        <h2 className="text-xl font-semibold">Email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Drop me an email at{" "}
          <a
            href="mailto:contact@dailysparks.rushabh.in"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            contact@dailysparks.rushabh.in
          </a>
        </p>
      </section>

      <section className="mt-8 rounded-2xl border bg-background p-6">
        <h2 className="text-xl font-semibold">Social</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You can also connect with me on{" "}
          <a
            href="https://www.linkedin.com/in/rushabh-bhosale-software-developer/"
            target="_blank"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            LinkedIn
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/RushabhBhosale"
            target="_blank"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            GitHub
          </a>
          .
        </p>
      </section>

      <section className="mt-8 rounded-2xl border bg-background p-6">
        <h2 className="text-xl font-semibold">Collaboration</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Open to product reviews, sponsored posts, or partnerships that align
          with Daily Sparks’ themes (tech, travel, anime, and TV).
        </p>
      </section>
    </main>
  );
}
