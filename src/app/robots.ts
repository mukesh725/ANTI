import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const forwardedHost = headersList.get('x-forwarded-host');
  const hostHeader = headersList.get('host');
  const host = forwardedHost || hostHeader || 'airoessentials.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/ecommerce/checkout', '/ecommerce/account'],
    },
    sitemap: `${protocol}://${host}/sitemap.xml`,
  };
}
