import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Script from "next/script";
import SplashScreen from "@/components/brand/SplashScreen";
import { splashBootScript } from "@/components/brand/splash-boot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A1020",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://myconnecta.ng"),
  title: {
    default: "Connecta | Find Trusted Local Service Professionals in Kano",
    template: "%s | Connecta",
  },
  description:
    "Connecta helps you discover local service professionals for home repairs, installations, and everyday maintenance in Kano, Nigeria. Find trusted plumbers, electricians, AC technicians, carpenters, and painters.",
  keywords: [
    "Connecta",
    "local services Kano",
    "plumbers in Kano",
    "electricians in Kano",
    "AC repair Kano",
    "carpentry Kano",
    "painters Kano",
    "home repairs Kano",
    "handyman Kano",
    "skilled trades Nigeria",
  ],
  alternates: {
    canonical: "https://myconnecta.ng",
  },
  icons: {
    icon: [
      { url: "/brand/favicon/favicon.ico", sizes: "any" },
      { url: "/brand/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon/connecta-icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/brand/app-icons/connecta-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/brand/app-icons/site.webmanifest",
  openGraph: {
    title: "Connecta | Find Trusted Local Service Professionals in Kano",
    description:
      "Connecta helps you discover local service professionals for home repairs, installations, and everyday maintenance in Kano, Nigeria. Find trusted plumbers, electricians, AC technicians, carpenters, and painters.",
    url: "https://myconnecta.ng",
    siteName: "Connecta",
    images: [
      {
        url: "/brand/social/connecta-social-avatar-512.png",
        width: 512,
        height: 512,
        alt: "Connecta: Local Services Marketplace in Kano",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Trusted Local Service Professionals | Connecta",
    description:
      "Find plumbers, electricians, repair technicians, carpenters, and other local professionals with Connecta.",
    images: ["/brand/social/connecta-social-avatar-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://connecta.ng/#organization",
      name: "Connecta",
      url: "https://connecta.ng",
      logo: "https://connecta.ng/brand/social/connecta-social-avatar-512.png",
      description:
        "Connecta is a local services marketplace connecting customers with verified artisans and technical repair professionals across Nigeria.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kano",
        addressRegion: "Kano State",
        addressCountry: "NG",
      },
      sameAs: [
        "https://x.com/Connectainc",
        "https://www.facebook.com/profile.php?id=61587476974482",
        "https://www.instagram.com/connecta_inc",
        "https://www.tiktok.com/@connecta_inc",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://connecta.ng/#website",
      url: "https://connecta.ng",
      name: "Connecta",
      publisher: {
        "@id": "https://connecta.ng/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://connecta.ng/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F5F7FC] text-[#0A1020]">
        <Script id="cn-splash-boot" strategy="beforeInteractive">
          {splashBootScript}
        </Script>
        <SplashScreen />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
