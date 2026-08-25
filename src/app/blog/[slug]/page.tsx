import { getBlogBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { headers } from "next/headers";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription,
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
  
  // Blog JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": blog.title,
    "description": blog.seoDescription,
    "image": blog.coverImage,  
    "author": {
      "@type": "Person",
      "name": blog.author
    },  
    "publisher": {
      "@type": "Organization",
      "name": host.includes("airohealthhub") ? "AIRO Health Hub" : "AIRO Essentials",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": blog.publishedAt,
    "dateModified": blog.publishedAt
  };

  return (
    <article className="w-full bg-paper text-ink min-h-screen">
      <SchemaOrg schema={schema} />
      
      {/* Header Image */}
      {blog.coverImage && (
        <div className="relative w-full h-[50vh] min-h-[400px] bg-theme/5">
          <Image 
            src={blog.coverImage} 
            alt={blog.title} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 relative -mt-32 md:-mt-48 z-10">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-[10px] tracking-[0.2em] uppercase font-bold text-ink/60 hover:text-theme transition-colors mb-10"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Journal
        </Link>

        {/* Title Block */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-ink/5 mb-16">
          <div className="flex items-center gap-4 text-xs font-medium text-ink/50 uppercase tracking-wider mb-6">
            <span className="text-theme font-bold">{blog.author}</span>
            <span>&bull;</span>
            <time dateTime={blog.publishedAt}>
              {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] tracking-tight mb-8">
            {blog.title}
          </h1>
        </div>

        {/* Article Body */}
        <div 
          className="prose prose-lg md:prose-xl prose-stone max-w-none 
          prose-headings:font-serif prose-headings:font-normal prose-headings:text-ink
          prose-p:text-ink/80 prose-p:leading-relaxed prose-p:font-serif
          prose-a:text-theme prose-a:underline-offset-4 hover:prose-a:text-blue-600
          prose-strong:text-ink prose-strong:font-semibold
          prose-blockquote:border-theme prose-blockquote:bg-theme/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-ink"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
      </div>
    </article>
  );
}
