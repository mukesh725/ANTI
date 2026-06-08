import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact AIRO Health | Schedule Consultation & Health Chair Scan",
  description: "Get in touch with the AIRO Health concierge team. Book your 5-Minute Health Chair scan, select custom lab testing panels, or schedule a doctor consultation.",
  keywords: [
    "contact AIRO Health",
    "book wellness consultation",
    "schedule health chair scan",
    "AIRO clinic contact",
    "health concierge phone",
    "longevity center contact"
  ]
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
