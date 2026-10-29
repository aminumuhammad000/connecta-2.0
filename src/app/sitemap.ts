import { MetadataRoute } from 'next'
import { getAllPublicProviders } from '@/lib/server/providers'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://myconnecta.ng'
  const staticLastMod = '2026-10-25T12:00:00.000Z'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticLastMod,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: staticLastMod,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/requests/new`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic provider profile routes for SEO scraping
  try {
    const providers = getAllPublicProviders()
    const providerRoutes: MetadataRoute.Sitemap = providers.map((p) => ({
      url: `${baseUrl}/discover/${p.id}`,
      lastModified: p.joinedDate || staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.85,
    }))

    return [...staticRoutes, ...providerRoutes]
  } catch (err) {
    console.error('[Sitemap] Failed to load provider routes:', err)
    return staticRoutes
  }
}
