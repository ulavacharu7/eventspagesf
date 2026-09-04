import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const FAVICON_URL = "https://ik.imagekit.io/dypkhqxip/events-sf?updatedAt=1787505317349";

export const metadata: Metadata = {
  metadataBase: new URL("https://events.studentforge.in"),
  authors: [{ name: "Studio Redlix", url: "https://www.redlix.co.in/" }],
  creator: "Studio Redlix",
  publisher: "Studio Redlix",
  title: "Student Forge Events | Campus Events, Workshops & Ticketing Portal",
  description: "Discover, host, and RSVP for campus workshops, student hackathons, tech meetups, and college gatherings with live custom QR check-in passes.",
  icons: {
    icon: [
      { url: FAVICON_URL, type: "image/svg+xml" },
    ],
    shortcut: FAVICON_URL,
    apple: FAVICON_URL,
  },
  openGraph: {
    title: "Student Forge Events | Campus Events, Workshops & Ticketing Portal",
    description: "Discover, host, and RSVP for campus workshops, student hackathons, tech meetups, and college gatherings with live custom QR check-in passes.",
    url: "https://events.studentforge.in",
    siteName: "Student Forge Events",
    images: [
      {
        url: "https://ik.imagekit.io/dypkhqxip/events%20by%20main.png",
        width: 1200,
        height: 630,
        alt: "Student Forge Events Campus Ticketing Portal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Forge Events | Campus Events, Workshops & Ticketing Portal",
    description: "Discover, host, and RSVP for campus workshops, student hackathons, tech meetups, and college gatherings with live custom QR check-in passes.",
    images: ["https://ik.imagekit.io/dypkhqxip/events%20by%20main.png"],
  },
  verification: {
    google: "google-site-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={FAVICON_URL} type="image/svg+xml" />
        {/* Material Symbols */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add_box"
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0EBKZ76ZHP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0EBKZ76ZHP');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
