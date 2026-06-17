import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | HIPAA Compliance & Data Protection",
  description: "Read AIRO Health's privacy policy. Learn how we collect, secure, and manage names, emails, and phone numbers in compliance with HIPAA guidelines.",
  keywords: [
    "privacy policy",
    "HIPAA compliance",
    "data protection",
    "patient privacy",
    "healthcare privacy policy",
    "AIRO privacy"
  ]
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
