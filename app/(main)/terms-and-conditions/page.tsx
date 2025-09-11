// app/terms-and-conditions/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Daily Sparks",
  description:
    "Read the Terms & Conditions for using Daily Sparks (dailysparks.in).",
  alternates: { canonical: "https://dailysparks.in/terms-and-conditions" },
  openGraph: {
    type: "website",
    url: "https://dailysparks.in/terms-and-conditions",
    title: "Terms & Conditions — Daily Sparks",
    description:
      "Terms for using Daily Sparks, including usage, IP, and disclaimers.",
    siteName: "Daily Sparks",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-6">Last Updated: August 23, 2025</p>

      <p className="mb-6">
        Welcome to <strong>Daily Sparks</strong> (dailysparks.in). By accessing
        or using our website, you agree to comply with and be bound by these
        Terms & Conditions. Please read them carefully.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of Website</h2>
      <p className="mb-6">
        You agree to use this website only for lawful purposes and in a manner
        that does not infringe the rights of, restrict, or inhibit anyone else's
        use of the site.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. Intellectual Property
      </h2>
      <p className="mb-6">
        All content on this website, including text, images, logos, and code, is
        the property of Your Blog Website unless otherwise stated. You may not
        copy, reproduce, or distribute our content without prior written
        permission.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
      <p className="mb-6">
        If you post comments, articles, or other content on our site, you grant
        us a non-exclusive, royalty-free, perpetual license to use, modify, and
        display that content. You are responsible for ensuring your content does
        not violate any laws or rights of third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Links</h2>
      <p className="mb-6">
        Our website may contain links to third-party websites. We are not
        responsible for the content, privacy policies, or practices of third
        parties.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Disclaimer</h2>
      <p className="mb-6">
        The information on this website is provided "as is" without warranties
        of any kind. We do not guarantee the accuracy, completeness, or
        reliability of the content.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        6. Limitation of Liability
      </h2>
      <p className="mb-6">
        To the fullest extent permitted by law, Your Blog Website shall not be
        liable for any damages arising from your use of the website, including
        but not limited to direct, indirect, incidental, or consequential
        damages.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
      <p className="mb-6">
        We may update these Terms & Conditions from time to time. Any changes
        will be posted on this page with a new "Last Updated" date. Continued
        use of the site after changes indicates acceptance of the new terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
      <p className="mb-6">
        These Terms shall be governed by and construed in accordance with the
        laws of your country or state, without regard to conflict of law
        principles.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
      <p>
        If you have questions about these Terms & Conditions, please contact us
        at:
      </p>
      <p className="mt-4">
        📧 <strong>Email:</strong> rushabhbhosale25757@gmail.com
      </p>
    </div>
  );
}
