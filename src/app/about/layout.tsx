import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story & Preventive Mission",
  description: "Learn about AIRO's mission to transform healthcare from reactive treatment to proactive longevity, led by founder Kumar Swamy Maruri.",
  keywords: [
    "AIRO Health founder",
    "Kumar Swamy Maruri",
    "preventive medicine mission",
    "longevity history",
    "healthcare ecosystem",
    "About AIRO Health"
  ]
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
