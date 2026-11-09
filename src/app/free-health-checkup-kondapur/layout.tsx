import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Family Health Checkup in Kondapur | AIRO Health Hub",
  description:
    "All 9 vital checks 100% free – BP, ECG, blood sugar, SpO2, BMI & more. Open 24/7 in Kondapur. Book online or call +91 90001 82121.",
  alternates: {
    canonical: "https://airohealthhub.com/free-health-checkup-kondapur",
  },
  openGraph: {
    title: "Free Family Health Checkup in Kondapur | AIRO Health Hub",
    description: "9 vital checks in about 5 minutes. 100% free for every family member. Open 24/7 in Kondapur.",
    url: "https://airohealthhub.com/free-health-checkup-kondapur",
    siteName: "AIRO Health Hub",
    images: [
      {
        url: "/funnel/hero-bp-check.jpg",
        width: 1200,
        height: 630,
        alt: "Free Family Health Checkup at AIRO Health Hub Kondapur",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Family Health Checkup in Kondapur | AIRO Health Hub",
    description: "9 vital checks in about 5 minutes. 100% free for every family member. Open 24/7 in Kondapur.",
    images: ["/funnel/hero-bp-check.jpg"],
  },
};

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "AIRO Health Hub – Kondapur",
    "url": "https://airohealthhub.com/free-health-checkup-kondapur",
    "telephone": "+91-9000182121",
    "image": "https://airohealthhub.com/funnel/hero-bp-check.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No. 2, Ground & 1st Floor, Vamsiram's Jyothi Granules, Sy. No. 199",
      "addressLocality": "Kondapur, Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500084",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

