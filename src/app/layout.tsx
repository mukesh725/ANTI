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

  const isHealth = host.includes("airohealthhub") || host.includes("health.airo") || host.includes("airohealth-test");
  const isAiroOne = host.includes("airoone");
  
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
      icon: '/airo-1-logo.png',
      apple: '/airo-1-logo.png',
      shortcut: '/airo-1-logo.png',
    },
    verification: {
      google: isHealth 
        ? "RFAej7gtLQoXFPQw-zXvk8YiFE5s7lFnr-1FUkkpzAo" 
        : isAiroOne
        ? ["5l0JlpGXTEd68s6iu6VGXdeLIKYIJImZ6DBl11LcXuk", "u4tsheRcaLcoMG5niS00Yoay7Bj2uIJricQJaW55JPA"]
        : ["u4tsheRcaLcoMG5niS00Yoay7Bj2uIJricQJaW55JPA", "5l0JlpGXTEd68s6iu6VGXdeLIKYIJImZ6DBl11LcXuk"],
    }
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
  const host = (forwardedHost || hostHeader || "airoessentials.com").toLowerCase();
  const isHealth = host.includes("airohealthhub") || host.includes("health.airo") || host.includes("airohealth-test");
  const isAiroOne = host.includes("airoone");

  const gtmId = isHealth 
    ? 'GTM-WQTSLV2L' 
    : isAiroOne 
    ? 'GTM-TXC5289J' 
    : 'GTM-5Q324PFL';

  // AIO/GEO Structured Data
  const baseOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AIRO",
    "url": "https://www.airoessentials.com",
    "logo": "https://www.airoessentials.com/airo-1-logo.png",
    "sameAs": [
      "https://www.instagram.com/airoessentials",
      "https://www.facebook.com/airoessentials"
    ]
  };

  const schema = isHealth ? {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "AIRO Health Hub",
    "image": "https://www.airohealthhub.com/airo-1-logo.png",
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
    "image": "https://www.airoessentials.com/airo-1-logo.png",
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
        {/* Google Tag Manager - Multi-Domain Isolated */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,defaultId){
              try {
                var h = (w.location && w.location.hostname) ? w.location.hostname.toLowerCase() : '';
                var id = defaultId;
                if (h.includes('airohealthhub') || h.includes('health.airo') || h.includes('airohealth-test')) {
                  id = 'GTM-WQTSLV2L';
                } else if (h.includes('airoone')) {
                  id = 'GTM-TXC5289J';
                } else {
                  id = 'GTM-5Q324PFL';
                }
                w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+id+dl;f.parentNode.insertBefore(j,f);
              } catch(e) {}
            })(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}
        <SchemaOrg schema={schema} />
      </head>
      <body className="antialiased bg-paper text-ink min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ClientLayoutWrapper cmsData={cmsData}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
