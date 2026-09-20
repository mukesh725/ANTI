import { getBlogBySlug, getBlogsForSite } from "@/lib/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, User, ShieldCheck, 
  ArrowRight, Video, Stethoscope, ShoppingBag, Sparkles, CheckCircle2 
} from "lucide-react";
import type { Metadata } from "next";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { headers } from "next/headers";

interface Props {
  params: {
    slug: string;
  };
}

/**
 * Strips dangerous HTML tags and inline event handlers to prevent XSS (Point 8)
 */
function sanitizeBlogHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href="#"');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    return {
      title: "Article Not Found | AIRO",
    };
  }

  return {
    title: blog.seoTitle || `${blog.title} | AIRO Journal`,
    description: blog.seoDescription,
    keywords: [
      blog.title,
      blog.targetSite === "health" ? "telemedicine doctor consultation" : "organic grocery online",
      "preventive health",
      "AIRO longevity"
    ],
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription,
      type: "article",
      publishedTime: blog.publishedAt,
      authors: [blog.author],
      images: blog.coverImage ? [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription,
      images: blog.coverImage ? [blog.coverImage] : [],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    notFound();
  }

  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "airoessentials.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const url = `${baseUrl}/blog/${blog.slug}`;
  const isHealth = host.includes("airohealthhub") || blog.targetSite === "health";

  // Fetch 3 related articles
  const allBlogs = await getBlogsForSite(isHealth ? "health" : "essentials");
  const relatedBlogs = allBlogs
    .filter(b => b.slug !== blog.slug)
    .slice(0, 3);
  
  // BlogPosting JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": blog.title,
    "description": blog.seoDescription,
    "image": blog.coverImage || `${baseUrl}/logo.png`,  
    "author": {
      "@type": "Person",
      "name": blog.author,
      "jobTitle": "Clinical & Wellness Specialist",
      "worksFor": {
        "@type": "Organization",
        "name": isHealth ? "AIRO Health Hub" : "AIRO Essentials"
      }
    },  
    "publisher": {
      "@type": "Organization",
      "name": isHealth ? "AIRO Health Hub" : "AIRO Essentials",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": blog.publishedAt,
    "dateModified": blog.publishedAt
  };

  return (
    <article className="w-full bg-[#fdfdfc] text-slate-900 min-h-screen">
      <SchemaOrg schema={schema} />
      
      {/* Header Cover Image */}
      {blog.coverImage && (
        <div className="relative w-full h-[45vh] min-h-[380px] max-h-[500px] bg-slate-900 overflow-hidden">
          <Image 
            src={blog.coverImage} 
            alt={blog.title} 
            fill 
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfdfc] via-transparent to-black/30" />
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 relative -mt-24 md:-mt-36 z-10">
        
        {/* Back Navigation & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-emerald-700 transition-colors bg-white/90 backdrop-blur px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Journal
          </Link>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
            {blog.targetSite === "health" ? "Clinical Health & Longevity" : blog.targetSite === "essentials" ? "Organic Nutrition" : "Longevity Science"}
          </span>
        </div>

        {/* Title & Author Meta Card */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/70 mb-12">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-6">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {blog.author}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span>&bull;</span>
            <span>5 min read</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-6">
            {blog.title}
          </h1>

          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-6">
            {blog.seoDescription}
          </p>
        </div>

        {/* Article Body */}
        <div 
          className="prose prose-lg prose-slate max-w-none 
          prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
          prose-ul:text-slate-700 prose-li:my-1.5
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-a:text-emerald-600 prose-a:font-semibold hover:prose-a:text-emerald-700"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.content) }}
        />

        {/* HIGH-CONVERSION CALL-TO-ACTION CARD */}
        <div className="my-16 p-8 md:p-10 rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            {blog.targetSite === "health" || blog.targetSite === "both" ? (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-4">
                  <Stethoscope className="w-3.5 h-3.5" />
                  AIRO Health Telemedicine & Walk-in Clinics
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Speak with a Doctor or Schedule Your 3D Health Scan
                </h3>
                <p className="text-slate-300 text-sm md:text-base max-w-xl mb-6 leading-relaxed">
                  Connect instantly with licensed clinical specialists for diagnosis, treatment, and digital prescriptions. Or experience our non-invasive 15-minute AIRO Praana vital checkup in Hyderabad.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    href="/minute-clinic/booking?mode=virtual"
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Book Video Consultation (₹499)</span>
                  </Link>
                  <Link 
                    href="/health-chair"
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Explore Praana Health Chair</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-4">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  AIRO Essentials 100% Certified Organic Pantry
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Upgrade Your Kitchen to 100% Chemical-Free Food
                </h3>
                <p className="text-slate-300 text-sm md:text-base max-w-xl mb-6 leading-relaxed">
                  Protect your cellular health with raw wood-pressed cooking oils, unadulterated organic grains, A2 desi cow ghee, and zero-pesticide grocery staples delivered direct from organic farms.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link 
                    href="/grocery"
                    className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-400/20 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop Organic Groceries</span>
                  </Link>
                  <Link 
                    href="/essentials"
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Explore Cold-Pressed Oils</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-slate-200 pt-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
              More From the AIRO Journal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-emerald-300 transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                    {item.targetSite === "health" ? "Clinical Health" : "Organic Nutrition"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.seoDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
