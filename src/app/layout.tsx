import type { Metadata } from "next";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { getCmsData } from "@/lib/cms";

import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const forwardedHost = headersList.get("x-forwarded-host");
  const hostHeader = headersList.get("host");
  const host = forwardedHost || hostHeader || "airoessentials.com";

  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const isHealth = host.includes("airohealthhub");
  
  const cmsData = await getCmsData();
  const homeData = cmsData.pages.home;
  
  const siteName = isHealth ? "AIRO Health Hub" : "AIRO Essentials";
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmsSeoTitle = (homeData as any)?.seoTitle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmsSeoDesc = (homeData as any)?.seoDescription;

  const defaultTitle = isHealth 
    ? "AIRO Health Hub | Premium Clinical & Longevity Care Ecosystem"
    : (cmsSeoTitle || "AIRO Essentials | Premium Organic Grocery, Bakery & Superfoods");
    
  const description = isHealth
    ? "AIRO Health Hub is a premium clinical facility offering a 5-Minute Health Chair Scan, preventive medicine, longevity protocols, Minute Clinics, and advanced Compounding Pharmacy services."
    : (cmsSeoDesc || "AIRO Essentials is a premium organic grocery, superfood cafe, and clean-eating destination focused on longevity, nutrition, and 100% pesticide-free sourcing.");
    
  const keywords = isHealth
    ? [
        "health hub",
        "preventive healthcare",
        "health optimization",
        "longevity clinic",
        "pharmacy & compounding",
        "wellness clinic",
        "health chair assessment",
        "minute clinic",
        "personalized medicine",
        "clinical diagnostics"
      ]
    : [
        "organic grocery",
        "clean eating",
        "superfoods",
        "pesticide-free food",
        "organic bakery",
        "healthy cafe",
        "nutrition",
        "wellness foods",
        "longevity diet",
        "airo essentials"
      ];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`
    },
    description: description,
    keywords: keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${siteName} | Premium Longevity & Wellness Ecosystem`,
      description: "Proactive, personalized healthcare focused on prevention, optimization, and longevity.",
      url: baseUrl,
      siteName: siteName,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteName} Longevity Ecosystem`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Premium Longevity & Wellness Ecosystem`,
      description: "Proactive, personalized healthcare focused on prevention, optimization, and longevity.",
      images: ["/og-image.jpg"],
    },
    icons: {
      icon: isHealth ? '/airo-health-favicon.png' : '/airo-essentials-favicon.png',
      apple: isHealth ? '/airo-health-favicon.png' : '/airo-essentials-favicon.png',
      shortcut: isHealth ? '/airo-health-favicon.png' : '/airo-essentials-favicon.png',
    },
  };
}

import { SchemaOrg } from "@/components/seo/SchemaOrg";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cmsData = await getCmsData();
  const headersList = headers();
  const forwardedHost = headersList.get("x-forwarded-host");
  const hostHeader = headersList.get("host");
  const host = forwardedHost || hostHeader || "airoessentials.com";
  const isHealth = host.includes("airohealthhub");

  // AIO/GEO Structured Data
  const baseOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AIRO",
    "url": "https://www.airoessentials.com",
    "logo": "https://www.airoessentials.com/airo-essentials-logo.png",
    "sameAs": [
      "https://www.instagram.com/airoessentials",
      "https://www.facebook.com/airoessentials"
    ]
  };

  const schema = isHealth ? {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "AIRO Health Hub",
    "image": "https://www.airohealthhub.com/airo-health-logo.png",
    "url": "https://www.airohealthhub.com",
    "telephone": "+1-800-555-AIRO",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Wellness Ave",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "medicalSpecialty": [
      "Preventive Medicine",
      "Longevity",
      "Pharmacy"
    ],
    "parentOrganization": baseOrganizationSchema
  } : {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "AIRO Essentials",
    "image": "https://www.airoessentials.com/airo-essentials-logo.png",
    "url": "https://www.airoessentials.com",
    "telephone": "+1-800-555-AIRO",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Wellness Ave",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "parentOrganization": baseOrganizationSchema
  };

  return (
    <html lang="en" className="bg-paper">
      <head>
        <SchemaOrg schema={schema} />
      </head>
      <body className="antialiased bg-paper text-ink min-h-screen flex flex-col">
        <ClientLayoutWrapper cmsData={cmsData}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
