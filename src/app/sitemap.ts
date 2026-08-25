import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getBlogsForSite } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const forwardedHost = headersList.get('x-forwarded-host');
  const hostHeader = headersList.get('host');
  const host = forwardedHost || hostHeader || 'airoessentials.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const isHealth = host.includes('airohealthhub');
  const siteType = isHealth ? 'health' : 'essentials';

  const healthRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/minute-clinic`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/health-chair`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/pharmacy`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/membership`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/book-health-scan`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  const essentialsRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/grocery`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/membership`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
  ];

  const baseRoutes = isHealth ? healthRoutes : essentialsRoutes;

  try {
    const blogs = await getBlogsForSite(siteType);
    const blogRoutes = blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    return [...baseRoutes, ...blogRoutes];
  } catch (e) {
    console.error("Error generating sitemap blogs:", e);
    return baseRoutes;
  }
}
