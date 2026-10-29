import { redirect } from 'next/navigation'

export default async function RegisterRolePage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams
  redirect(role === 'provider' ? '/register?role=provider' : '/register')
}
