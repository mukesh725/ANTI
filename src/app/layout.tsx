import type { Metadata } from "next";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "AIRO Health | Premium Integrated Longevity & Wellness Ecosystem",
    template: "%s | AIRO Health"
  },
  description: "AIRO Health is a premium preventive healthcare and health optimization ecosystem combining the 5-Minute Health Chair Scan, Advanced Labs, Minute Clinic, Compounding Pharmacy, and Essentials Grocery.",
  keywords: [
    "health",
    "preventive healthcare",
    "health optimization",
    "longevity clinic",
    "compounding pharmacy",
    "wellness clinic",
    "health chair assessment",
    "IV therapy",
    "organic grocery",
    "personalized medicine",
    "wellness concierge"
  ],
  openGraph: {
    title: "AIRO Health | Premium Longevity & Wellness Ecosystem",
    description: "Proactive, personalized healthcare focused on prevention, optimization, and longevity.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-alabaster">
      <body className="antialiased bg-alabaster text-charcoal min-h-screen flex flex-col">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
