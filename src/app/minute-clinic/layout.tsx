import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRO Minute Clinic | Rapid Diagnostics & Primary Care",
  description: "AIRO Minute Clinic offers swift clinical care, vaccinations, physicals, and advanced diagnostic testing alongside the 5-Minute Health Chair Assessment.",
  keywords: [
    "preventive care clinic",
    "rapid diagnostics",
    "minute clinic",
    "health chair assessment",
    "annual physicals",
    "medical wellness clinic",
    "doctor consultation near me",
    "AIRO Minute Clinic"
  ]
};

export default function MinuteClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
