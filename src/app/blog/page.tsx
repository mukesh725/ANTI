import { getBlogsForSite } from "@/lib/blog";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";

export default async function BlogIndexPage() {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "airoessentials.com";
  const isHealth = host.includes("airohealthhub");
  
  const siteType = isHealth ? "health" : "essentials";
  const blogs = await getBlogsForSite(siteType);

  return (
    <div className="w-full bg-paper text-ink min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <span className="text-[10px] tracking-[0.25em] uppercase text-ink/60 mb-4 font-semibold block">
            {isHealth ? "AIRO Health Journal" : "AIRO Essentials Journal"}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-ink tracking-tight mb-6">
            Insights & Science
          </h1>
          <p className="text-ink/75 max-w-2xl mx-auto font-serif italic text-lg md:text-xl">
            {isHealth 
              ? "Discover the latest in longevity, proactive medicine, and health optimization." 
              : "Explore our latest insights on clean eating, sustainable wellness, and organic nutrition."}
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-20 border border-ink/10 rounded-2xl bg-white/50">
            <h3 className="text-xl font-serif text-ink mb-2">No articles found.</h3>
            <p className="text-ink/60">Check back soon for our latest updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link 
                href={`/blog/${blog.slug}`} 
                key={blog.id}
                className="group block rounded-2xl border border-ink/10 overflow-hidden bg-white hover:shadow-xl hover:border-theme/30 transition-all duration-300"
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                  {blog.coverImage ? (
                    <Image 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-theme/5 flex items-center justify-center">
                      <span className="text-theme/40 font-serif italic">AIRO</span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] tracking-[0.15em] uppercase font-bold text-theme">
                      {blog.author}
                    </span>
                    <span className="text-[10px] text-ink/50">
                      {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-ink leading-tight mb-3 group-hover:text-theme transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-ink/70 line-clamp-3">
                    {blog.seoDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
