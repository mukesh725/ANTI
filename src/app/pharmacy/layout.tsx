import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRO Compounding Pharmacy | Personalized Medicine & Custom Prescriptions",
  description: "AIRO Pharmacy combines standard prescription care with custom compounding services. Personalized dosages, flexible formulations, and clean ingredients tailored for your wellness.",
  keywords: [
    "compounding pharmacy",
    "personalized medicine",
    "custom prescriptions",
    "alternative dosages",
    "longevity supplements",
    "allergy free medications",
    "prescriptions near me",
    "AIRO Pharmacy"
  ]
};

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
