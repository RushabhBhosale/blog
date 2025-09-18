import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/utils/useAuth";
import BackToTop from "@/components/BackToTop";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
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
  alternates: {
    canonical: "https://dailysparks.in",
  },
  authors: [{ name: "Rushabh Bhosale" }],
  openGraph: {
    title: "Daily Sparks ⚡ Fresh Ideas, Every Day",
    description:
      "Discover stories on anime, tech, and travel that spark curiosity, knowledge, and adventure.",
    url: "https://dailysparks.in",
    siteName: "Daily Sparks",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Daily Sparks Cover",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Sparks ⚡ Fresh Ideas, Every Day",
    description: "Anime, tech, and travel stories that ignite your curiosity.",
    images: ["https://dailysparks.in/og-image.jpg"],
    creator: "@yourhandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1425611919231559"
        crossOrigin="anonymous"
      ></script>

      <meta
        name="google-adsense-account"
        content="ca-pub-1425611919231559"
      ></meta>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global header with search aligned to SearchAction */}
        <header className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            <a href="/" className="font-semibold text-lg">DailySparks</a>
            <form
              action="/"
              method="get"
              className="ml-auto flex items-center gap-2"
              role="search"
              aria-label="Site search"
            >
              <input
                type="search"
                name="s"
                placeholder="Search..."
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              />
              <button type="submit" className="rounded-md border px-3 py-1.5 text-sm">
                Search
              </button>
            </form>
          </div>
        </header>
        <Toaster />
        <AuthProvider>{children}</AuthProvider>
        <BackToTop />
      </body>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PV1MX0D6C5"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PV1MX0D6C5');
          `}
      </Script>

      {/* Organization + WebSite (SearchAction) JSON-LD */}
      <Script id="org-website-jsonld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://dailysparks.com/#organization",
              "name": "DailySparks",
              "url": "https://dailysparks.com/",
              "logo": {
                "@type": "ImageObject",
                "url": "[insert logo URL]"
              },
              "sameAs": [
                "[insert Twitter URL]",
                "[insert Facebook URL]",
                "[insert Instagram URL]",
                "[insert LinkedIn URL]",
                "[insert YouTube URL]"
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://dailysparks.com/#website",
              "url": "https://dailysparks.com/",
              "name": "DailySparks",
              "publisher": { "@id": "https://dailysparks.com/#organization" },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://dailysparks.com/?s={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ]
        })}
      </Script>
    </html>
  );
}
