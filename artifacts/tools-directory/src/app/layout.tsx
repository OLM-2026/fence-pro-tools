import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fenceprotools.com"),
  title: {
    default: "FenceProTools – Best Software for Fence Contractors",
    template: "%s | FenceProTools",
  },
  description:
    "The #1 curated directory of software tools for fencing contractors. Compare estimating, CRM, scheduling, invoicing, and field service software built for fence companies.",
  keywords: [
    "fence contractor software",
    "fencing business software",
    "fence estimating software",
    "fence CRM",
    "fence scheduling software",
    "field service software for fence companies",
  ],
  openGraph: {
    type: "website",
    siteName: "FenceProTools",
    url: "https://fenceprotools.com",
    title: "FenceProTools – Best Software for Fence Contractors",
    description:
      "The #1 curated directory of software tools for fencing contractors. Compare estimating, CRM, scheduling, invoicing, and field service software.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FenceProTools – Best Software for Fence Contractors",
    description:
      "The #1 curated directory of software tools for fencing contractors.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "rGktvnjPAN-kJx-Ej04GaIu0tUWgDkbpQghaJTlduhI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
