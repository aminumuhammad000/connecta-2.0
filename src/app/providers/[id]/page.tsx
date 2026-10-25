import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProviderRedirectPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/discover/${id}`)
}
