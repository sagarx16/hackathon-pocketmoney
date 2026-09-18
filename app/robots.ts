import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/home', '/login'],
        disallow: ['/api/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: 'https://pocketbank.vercel.app/sitemap.xml',
  };
}
