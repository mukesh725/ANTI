import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Legal Agreement & Disclaimers",
  description: "Read AIRO Health's Terms of Service. Understand clinical disclaimers, practitioner assessments, and informational limitations of our wellness content.",
  keywords: [
    "terms of service",
    "clinical disclaimers",
    "practitioner assessment",
    "informational only website",
    "medical disclaimer",
    "AIRO terms"
  ]
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
