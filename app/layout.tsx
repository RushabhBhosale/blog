import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/utils/useAuth";
import BackToTop from "@/components/BackToTop";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dailysparks.in"),
  title: "Daily Sparks ⚡ Fresh Ideas, Every Day",
  description:
    "From anime sagas to the latest tech trends and travel escapes across the globe — discover stories that spark inspiration, knowledge, and adventure.",
  keywords: [
    "Daily Sparks",
    "anime blog",
    "tech blog",
    "travel blog",
    "reviews",
    "guides",
  ],
  alternates: { canonical: "https://dailysparks.in" },
  authors: [{ name: "Rushabh Bhosale" }],
  openGraph: {
    title: "Daily Sparks ⚡ Fresh Ideas, Every Day",
    description:
      "Discover stories on anime, tech, and travel that spark curiosity, knowledge, and adventure.",
    url: "https://dailysparks.in",
    siteName: "Daily Sparks",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Daily Sparks Cover",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Sparks ⚡ Fresh Ideas, Every Day",
    description: "Anime, tech, and travel stories that ignite your curiosity.",
    images: ["https://dailysparks.in/opengraph.png"],
    creator: "@yourhandle",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1425611919231559" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider>{children}</AuthProvider>
        <BackToTop />
      </body>

      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1425611919231559"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PV1MX0D6C5"
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          (window.requestIdleCallback || function(cb){setTimeout(cb, 1)})(function () {
            gtag('js', new Date());
            gtag('config', 'G-PV1MX0D6C5', { send_page_view: true });
          });
        `}
      </Script>

      <Script id="org-website-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://dailysparks.in/#organization",
              name: "Daily Sparks",
              url: "https://dailysparks.in/",
              logo: {
                "@type": "ImageObject",
                url: "https://dailysparks.in/logo.png",
              },
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": "https://dailysparks.in/#website",
              url: "https://dailysparks.in/",
              name: "Daily Sparks",
              publisher: { "@id": "https://dailysparks.in/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://dailysparks.in/?s={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        })}
      </Script>
    </html>
  );
}
