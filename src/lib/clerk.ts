import { auth, currentUser } from '@clerk/nextjs/server'
import { UserRole } from '@/types/database'

export interface AuthenticatedUser {
  userId: string
  email?: string
  fullName: string
  phone?: string
  roles: UserRole[]
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const user = await currentUser()
    if (!user) return null

    const primaryEmail = user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
    const primaryPhone = user.phoneNumbers?.[0]?.phoneNumber || ''
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Connecta User'

    // Extract roles from Clerk publicMetadata or default to customer
    const roles = (user.publicMetadata?.roles as UserRole[]) || ['customer']

    return {
      userId,
      email: primaryEmail,
      fullName,
      phone: primaryPhone,
      roles,
    }
  } catch (error) {
    console.warn('[Clerk Auth] Session check bypassed or unconfigured:', error)
    return null
  }
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()
  if (!user) {
    throw new Error('UNAUTHORIZED: Authentication required')
  }
  return user
}

export async function requireRole(role: UserRole): Promise<AuthenticatedUser> {
  const user = await requireAuth()
  if (!user.roles.includes(role) && !user.roles.includes('admin')) {
    throw new Error(`FORBIDDEN: User lacks required role [${role}]`)
  }
  return user
}
