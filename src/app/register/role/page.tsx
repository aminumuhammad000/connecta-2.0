import { redirect } from 'next/navigation'

export default function RegisterRolePage() {
  redirect('/onboarding?step=role')
}
