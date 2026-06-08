import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRO Essentials | Premium Organic & Wellness Grocery Sourcing",
  description: "Experience conscious nutrition at AIRO Essentials. Curating premium, organic, local, and sustainable ingredients to fuel your longevity and daily wellness.",
  keywords: [
    "organic grocery",
    "wellness food retail",
    "artisanal market",
    "local food sourcing",
    "sustainable agriculture",
    "transparency nutrition",
    "healthy foods",
    "longevity diet",
    "AIRO Essentials"
  ]
};

export default function EssentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
