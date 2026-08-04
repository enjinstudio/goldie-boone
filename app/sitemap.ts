import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      // The provenance disclosure. Listed so it is indexable and citable in
      // its own right: a disclosure only findable by clicking through the
      // footer is weaker than one a search engine can return directly.
      url: `${SITE_URL}/how-these-songs-are-made`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
