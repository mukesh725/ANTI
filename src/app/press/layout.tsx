import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press & Media Kit | Newsroom & Investor Resources",
  description: "Explore the AIRO Health press newsroom. Access our media kit, download brand assets, read news releases, and connect with media relations.",
  keywords: [
    "press kit",
    "media kit",
    "healthcare newsroom",
    "AIRO Health press",
    "investor relations",
    "brand assets",
    "AIRO news"
  ]
};

export default function PressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
