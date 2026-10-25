import { redirect } from 'next/navigation'
import { getAllPublicProviders } from '@/lib/server/providers'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const providers = getAllPublicProviders()
  return providers.map((p) => ({ id: p.id }))
}

export default async function ProviderRedirectPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/discover/${id}`)
}
