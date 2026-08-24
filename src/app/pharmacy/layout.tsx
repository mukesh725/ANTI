import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRO Pharmacy & Compounding | Personalized Medicine & Custom Prescriptions",
  description: "AIRO Pharmacy combines standard prescription care with custom compounding services. Personalized dosages, flexible formulations, and clean ingredients tailored for your wellness.",
  keywords: [
    "pharmacy & compounding",
    "personalized medicine",
    "custom prescriptions",
    "alternative dosages",
    "longevity supplements",
    "allergy free medications",
    "prescriptions near me",
    "AIRO Pharmacy & Compounding"
  ]
};

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
