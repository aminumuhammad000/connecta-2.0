import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPublicProviderById,
  getAllPublicProviders,
  generateProviderSchema,
} from '@/lib/server/providers'
import ProfileClientView from './ProfileClientView'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const providers = getAllPublicProviders()
  return providers.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const provider = getPublicProviderById(id)

  if (!provider) {
    return {
      title: 'Service Provider Profile | Connecta',
      description: 'Find verified artisans and technicians across Nigeria on Connecta.',
    }
  }

  const nairaRate = Math.round(provider.hourlyRateMinor / 100).toLocaleString()

  return {
    title: `${provider.fullName} (${provider.businessName}) - Verified ${provider.category} Specialist in ${provider.city}`,
    description: `${provider.headline}. Hourly rate: ₦${nairaRate}/hr. Rated ${provider.averageRating}/5 based on ${provider.reviewCount} verified client reviews in ${provider.city}, Nigeria. 100% Escrow Safeguarded.`,
    keywords: [
      provider.fullName,
      provider.businessName,
      provider.category,
      `${provider.category} ${provider.city}`,
      ...provider.skills,
      'Connecta verified specialist',
    ],
    alternates: {
      canonical: `https://myconnecta.ng/discover/${provider.id}`,
    },
    openGraph: {
      title: `${provider.fullName} | Verified ${provider.category} on Connecta`,
      description: `${provider.headline} • Rated ${provider.averageRating}/5 (${provider.reviewCount} reviews) • ₦${nairaRate}/hr • Verified in ${provider.city}, Nigeria. 100% Escrow Safeguarded.`,
      url: `https://myconnecta.ng/discover/${provider.id}`,
      siteName: 'Connecta Nigeria',
      locale: 'en_NG',
      type: 'profile',
      images: [
        {
          url: provider.avatarUrl || 'https://myconnecta.ng/brand/social/connecta-social-avatar-512.png',
          width: 512,
          height: 512,
          alt: `${provider.fullName} - ${provider.category}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${provider.fullName} | Verified ${provider.category} on Connecta`,
      description: `${provider.headline} • ₦${nairaRate}/hr • Verified specialist in ${provider.city}, Nigeria with 100% Escrow Safeguard.`,
      site: '@ConnectaNG',
      creator: '@ConnectaNG',
      images: [provider.avatarUrl || 'https://myconnecta.ng/brand/social/connecta-social-avatar-512.png'],
    },
  }
}

export default async function ProviderProfilePage({ params }: PageProps) {
  const { id } = await params
  const provider = getPublicProviderById(id)

  if (!provider) {
    notFound()
  }

  const jsonLd = generateProviderSchema(provider)

  // Get 3 other related specialists in the same category or city
  const allProviders = getAllPublicProviders()
  const relatedProviders = allProviders
    .filter((p) => p.id !== provider.id && (p.categorySlug === provider.categorySlug || p.city === provider.city))
    .slice(0, 3)

  return (
    <>
      {/* Search Engine Structured Schema Markup for Googlebot & AI Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileClientView provider={provider} relatedProviders={relatedProviders} />
    </>
  )
}
