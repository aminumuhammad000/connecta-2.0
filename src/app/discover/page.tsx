import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  getAllPublicProviders,
  PublicProvider,
} from '@/lib/server/providers'
import DiscoverClientView from './DiscoverClientView'

export const metadata: Metadata = {
  title: 'Discover Verified Artisans & Service Providers in Nigeria | Connecta',
  description:
    'Browse vetted electricians, master plumbers, AC technicians, phone board engineers, and skilled trade professionals across Nigeria. 100% milestone escrow protection and transparent hourly rates.',
  keywords: [
    'find electricians Kano',
    'hire plumbers Nigeria',
    'verified artisans Lagos',
    'solar inverter installers Abuja',
    'phone repair specialists',
    'auto mechanics Port Harcourt',
    'escrow service marketplace Nigeria',
    'Connecta discover',
  ],
  alternates: {
    canonical: 'https://myconnecta.ng/discover',
  },
  openGraph: {
    title: 'Discover Verified Artisans & Service Providers | Connecta',
    description:
      'Search vetted technicians and trade specialists across Nigeria. Compare rates, read real client reviews, and hire with escrow milestone protection.',
    url: 'https://myconnecta.ng/discover',
    siteName: 'Connecta',
    images: [
      {
        url: 'https://myconnecta.ng/brand/social/connecta-social-avatar-512.png',
        width: 512,
        height: 512,
        alt: 'Connecta Discover Service Providers',
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
      <Suspense fallback={<div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center font-bold text-slate-500">Loading directory...</div>}>
        <DiscoverClientView initialProviders={initialProviders} />
      </Suspense>
    </>
  )
}
