import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1A73E8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://connecta.ng"),
  title: "Connecta — Trusted Local Services & Skilled Technicians",
  description:
    "Connect with verified local professionals: plumbers, electricians, phone and computer technicians, mechanics, and carpenters in Kano and across Nigeria. Request quotes, compare, and book with confidence.",
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
    title: "Connecta — Trusted Local Services & Skilled Technicians",
    description:
      "Find and book verified artisans and repair specialists with transparent quotes and trusted reviews.",
    url: "https://connecta.ng",
    siteName: "Connecta",
    images: [
      {
        url: "/brand/social/connecta-social-avatar-512.png",
        width: 512,
        height: 512,
        alt: "Connecta Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#111827]">
        {children}
      </body>
    </html>
  );
}
