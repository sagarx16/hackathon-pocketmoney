import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pocketbank.vercel.app';
  const lastModified = new Date();

  const routes = [
    { url: `${baseUrl}`, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/home`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/accounts`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/transfers`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/cards`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/savings`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/chores`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/guardian`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/statements`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/profile`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/login`, priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  return routes.map((r) => ({
    url: r.url,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
