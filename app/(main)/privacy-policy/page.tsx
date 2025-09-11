// app/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Daily Sparks",
  description:
    "Read the Privacy Policy for Daily Sparks to understand how we collect, use, and protect your information.",
  alternates: { canonical: "https://dailysparks.in/privacy-policy" },
  openGraph: {
    type: "website",
    url: "https://dailysparks.in/privacy-policy",
    title: "Privacy Policy — Daily Sparks",
    description:
      "How Daily Sparks collects, uses, and protects your information.",
    siteName: "Daily Sparks",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-6">Last Updated: August 23, 2025</p>

      <p className="mb-6">
        At <strong>Your Blog Website</strong> (yourdomain.com), we respect your
        privacy and are committed to protecting your personal information. This
        Privacy Policy explains how we collect, use, and safeguard your data
        when you use our website.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Personal Information:</strong> If you create an account,
          comment, or contact us, we may collect your name, email address, and
          any details you provide.
        </li>
        <li>
          <strong>Non-Personal Information:</strong> We may collect browser
          type, IP address, device info, and browsing activity to improve our
          services.
        </li>
        <li>
          <strong>Cookies & Analytics:</strong> We use cookies and third-party
          analytics (like Google Analytics) to understand usage patterns and
          improve the website experience.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide and maintain our services</li>
        <li>Personalize your experience on the website</li>
        <li>Improve blog content and website performance</li>
        <li>Respond to inquiries and comments</li>
        <li>Send updates or newsletters (only if you subscribe)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. Sharing of Information
      </h2>
      <p className="mb-4">
        We <strong>do not sell or rent your personal information</strong>. We
        may share information only in the following cases:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>With trusted third-party services (e.g., analytics, hosting)</li>
        <li>If required by law or to protect rights, safety, or property</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          You can request access, correction, or deletion of your personal data.
        </li>
        <li>You can disable cookies in your browser settings.</li>
        <li>
          You can unsubscribe from our emails anytime by clicking “unsubscribe”
          at the bottom of the email.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
      <p className="mb-6">
        We use reasonable security measures to protect your information.
        However, no method of transmission over the internet is 100% secure, so
        we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Links</h2>
      <p className="mb-6">
        Our blog may contain links to other websites. We are not responsible for
        the privacy practices of third-party sites.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        7. Updates to This Policy
      </h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with a new “Last Updated” date.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:
      </p>
      <p className="mt-4">
        📧 <strong>Email:</strong> rushabhbhosale25757@gmail.com
      </p>
    </div>
  );
}
