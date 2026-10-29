import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPublicProviders } from '@/lib/server/providers'
import DiscoverClientView from './DiscoverClientView'
import { PageLoader } from '@/components/brand/ConnectaLoader'

export const metadata: Metadata = {
  title: 'Discover Verified Local Service Professionals in Kano & Nigeria',
  description:
    'Find and hire vetted local service professionals in Kano, Nigeria — including plumbers, electricians, AC technicians, carpenters, generator specialists, and skilled tradespeople with 100% milestone escrow protection.',
  keywords: [
    'find plumbers Kano',
    'hire electricians Kano',
    'AC repair technician Kano',
    'verified carpenters Kano',
    'generator repair Kano',
    'local service professionals Kano Nigeria',
    'auto mechanics Kano',
    'house painter Kano',
    'milestone escrow artisans Nigeria',
    'Connecta discover',
  ],
  alternates: {
    canonical: 'https://myconnecta.ng/discover',
  },
  openGraph: {
    title: 'Discover Verified Local Service Professionals in Kano | Connecta',
    description:
      'Browse vetted plumbers, electricians, AC technicians, carpenters, and local artisans in Kano. Compare transparent rates, inspect verified reviews, and hire with milestone escrow protection.',
    url: 'https://myconnecta.ng/discover',
    siteName: 'Connecta',
    images: [
      {
        url: 'https://myconnecta.ng/brand/social/connecta-social-avatar-512.png',
        width: 512,
        height: 512,
        alt: 'Connecta Discover Local Service Professionals',
      },
    ],
  },
}

export default function DiscoverPage() {
  const initialProviders = getAllPublicProviders()

  // Generate ItemList JSON-LD schema for search engine bot scraping
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verified Service Providers in Nigeria on Connecta',
    description: 'Directory of verified skilled trade professionals, artisans, and technicians in Nigeria.',
    numberOfItems: initialProviders.length,
    itemListElement: initialProviders.map((provider, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: provider.businessName,
      url: `https://myconnecta.ng/discover/${provider.id}`,
      item: {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        name: provider.businessName,
        alternateName: provider.fullName,
        description: provider.bio,
        telephone: provider.phone || '+234 812 345 6789',
        priceRange: `₦${Math.round(provider.hourlyRateMinor / 100).toLocaleString()}/hr`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: provider.city,
          addressRegion: provider.state,
          addressCountry: 'NG',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: provider.averageRating.toString(),
          reviewCount: provider.reviewCount.toString(),
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<PageLoader label="Finding professionals near you" />}>
        <DiscoverClientView initialProviders={initialProviders} />
      </Suspense>
    </>
  )
}
