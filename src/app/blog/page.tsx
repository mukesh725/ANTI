import { getBlogsForSite } from "@/lib/blog";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Calendar, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "airoessentials.com";
  const isHealth = host.includes("airohealthhub");
  
  const siteType = isHealth ? "health" : "essentials";
  const blogs = await getBlogsForSite(siteType);

  return (
    <div className="w-full bg-[#fcfcfb] text-slate-900 min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Hero */}
        <header className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold uppercase tracking-widest border border-emerald-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHealth ? "AIRO Health Science Journal" : "AIRO Essentials Wellness Journal"}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Evidence-Based Health & Nutrition
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-normal">
            {isHealth 
              ? "Clinical insights into non-invasive longevity screening, proactive telemedicine, and evidence-based disease prevention." 
              : "Expert guides on 100% certified organic living, cold-pressed wood-churned oils, pesticide-free nutrition, and clean pantry swaps."}
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-20 border border-slate-200 rounded-3xl bg-white shadow-xs max-w-lg mx-auto p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No articles published yet</h3>
            <p className="text-slate-500 text-sm">Check back shortly as our editorial board publishes new clinical guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link 
                href={`/blog/${blog.slug}`} 
                key={blog.id}
                className="group flex flex-col bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative w-full aspect-16/10 bg-slate-100 overflow-hidden">
                  {blog.coverImage ? (
                    <Image 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-emerald-50 flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-lg">AIRO Journal</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {blog.targetSite === "health" ? "Healthcare" : blog.targetSite === "essentials" ? "Organic" : "Longevity"}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {blog.author.split(",")[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      5 min read
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6 flex-1 font-normal">
                    {blog.seoDescription}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-auto">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
